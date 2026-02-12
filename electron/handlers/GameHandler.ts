import { app, ipcMain, IpcMainInvokeEvent, screen } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import AdmZip from 'adm-zip';
import { createWriteStream } from 'fs';
import { JavaManager } from './JavaManager.js';
import { UpdateManager } from './UpdateManager.js';
import { Logger } from './Logger.js';
import { getOverlayHandler } from '../main.js';

const execAsync = promisify(exec);

/**
 * Validates that a file is a valid ZIP before extraction
 */
function validateZipFile(zipPath: string): boolean {
    if (!fs.existsSync(zipPath)) return false;
    const buffer = fs.readFileSync(zipPath);
    // Check ZIP magic bytes (PK\x03\x04)
    return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B;
}

/**
 * Safely extract ZIP with validation
 */
function safeExtractZip(zipPath: string, destDir: string): void {
    if (!validateZipFile(zipPath)) {
        const buffer = fs.existsSync(zipPath) ? fs.readFileSync(zipPath) : Buffer.alloc(0);
        console.error(`[GameHandler] Invalid ZIP file: ${zipPath}. First bytes: ${buffer.slice(0, 20).toString('hex')}`);
        throw new Error(`Invalid ZIP file. The download may have failed.`);
    }
    fs.mkdirSync(destDir, { recursive: true });
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(destDir, true);
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract ZIP with retry logic for Windows file system race conditions
 * Uses exponential backoff: 500ms, 1000ms, 2000ms
 */
async function safeExtractZipWithRetry(zipPath: string, destDir: string, maxRetries: number = 3): Promise<void> {
    const delays = [500, 1000, 2000];
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            safeExtractZip(zipPath, destDir);
            return; // Success
        } catch (e: any) {
            lastError = e;

            if (attempt < maxRetries) {
                const delay = delays[attempt] || 2000;
                console.warn(`[GameHandler] Extraction failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
                await sleep(delay);
            }
        }
    }

    // All retries failed
    throw lastError || new Error(`Failed to extract ${zipPath} after ${maxRetries + 1} attempts`);
}

// Beta 1.7.3 Configuration
const VERSION_MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
const TARGET_VERSION_ID = 'b1.7.3';

interface GameSettings {
    minMemory: string;
    maxMemory: string;
    javaArgs: string;
    borderlessMode?: boolean;
}

interface GameOptions {
    username: string;
    gamePath?: string;
    javaPath?: string;
    settings?: GameSettings;
}

export class GameHandler {
    private gamePath: string;
    private javaPath: string;
    private javaManager: JavaManager;
    private updateManager: UpdateManager;
    private gameProcess: any = null;

    // Performance caches
    private lastUpdateCheck: { result: any; timestamp: number } | null = null;
    private readonly UPDATE_CACHE_TTL = 60000; // 60 seconds
    private readonly MANIFEST_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
    private lastInstanceVersion: string | null = null;

    constructor() {
        this.gamePath = path.join(app.getPath('userData'), 'gamedata');
        this.javaPath = 'java'; // Will be set by JavaManager
        this.javaManager = new JavaManager();
        this.updateManager = new UpdateManager();
        // Load last known instance version for remappedJars cache invalidation
        this.loadLastInstanceVersion();
    }

    private loadLastInstanceVersion(): void {
        try {
            const versionFile = path.join(app.getPath('userData'), 'versions.json');
            if (fs.existsSync(versionFile)) {
                const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
                this.lastInstanceVersion = data.instance || null;
            }
        } catch (e) {
            // Ignore errors
        }
    }

    public init() {
        ipcMain.handle('launch-game', async (event, options: GameOptions) => {
            return this.handleLaunch(event, options);
        });

        ipcMain.handle('kill-game', async () => {
            if (this.gameProcess) {
                console.log('Killing game process...');
                this.gameProcess.kill();
                this.gameProcess = null;
                return { success: true };
            }
            return { success: false, error: 'No game running' };
        });

        ipcMain.handle('check-custom-instance', async () => {
            const instanceZipPath = path.resolve('instance.zip');
            const instanceDir = path.join(app.getPath('userData'), 'instances', 'default', 'instance.cfg');
            return fs.existsSync(instanceZipPath) || fs.existsSync(instanceDir);
        });

        ipcMain.handle('check-update-status', async () => {
            return this.handleUpdateCheck();
        });

        ipcMain.handle('perform-update', async (event) => {
            return this.handlePerformUpdate(event);
        });
    }

    private sendProgress(sender: Electron.WebContents, status: string, progress: number) {
        sender.send('launch-progress', { status, progress });
    }

    /**
     * Fetches version details with 24h local cache to avoid network requests on every launch
     */
    private async getCachedVersionDetails(): Promise<any> {
        const cacheFile = path.join(app.getPath('userData'), 'mojang_version_cache.json');

        // Check cache
        if (fs.existsSync(cacheFile)) {
            try {
                const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
                if (Date.now() - cached.timestamp < this.MANIFEST_CACHE_TTL) {
                    console.log('[GameHandler] Using cached Mojang version details (TTL: 24h)');
                    return cached.data;
                }
            } catch (e) {
                console.warn('[GameHandler] Failed to read version cache:', e);
            }
        }

        // Fetch fresh
        console.log('[GameHandler] Fetching fresh Mojang version manifest...');
        const manifestRes = await fetch(VERSION_MANIFEST_URL);
        const manifest = await manifestRes.json() as any;
        const versionData = manifest.versions.find((v: any) => v.id === TARGET_VERSION_ID);
        if (!versionData) throw new Error(`Version ${TARGET_VERSION_ID} not found`);

        const versionDetailsRes = await fetch(versionData.url);
        const versionDetails = await versionDetailsRes.json() as any;

        // Save cache
        try {
            fs.writeFileSync(cacheFile, JSON.stringify({
                timestamp: Date.now(),
                data: versionDetails
            }));
            console.log('[GameHandler] Saved version details to cache');
        } catch (e) {
            console.warn('[GameHandler] Failed to save version cache:', e);
        }

        return versionDetails;
    }

    private async checkJava(path: string): Promise<boolean> {
        try {
            await execAsync(`"${path}" -version`);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Applies borderless fullscreen mode to the game window after it spawns.
     * Uses platform-specific methods to manipulate the window.
     */
    private async applyBorderlessPostSpawn(): Promise<void> {
        const { width, height } = screen.getPrimaryDisplay().size;

        // Wait for the game window to fully initialize
        await new Promise(resolve => setTimeout(resolve, 4000));

        try {
            if (process.platform === 'win32') {
                // Windows: Use PowerShell with inline C# to call Win32 APIs
                const psScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [DllImport("user32.dll")] public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);
    [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr hWnd, int nIndex);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
}
"@
$titles = @("Minecraft", "Minecraft Beta 1.7.3")
$h = [IntPtr]::Zero
foreach ($t in $titles) {
    $h = [Win32]::FindWindow([NullString]::Value, $t)
    if ($h -ne [IntPtr]::Zero) { break }
}
if ($h -eq [IntPtr]::Zero) {
    Get-Process java* | ForEach-Object { 
        if ($_.MainWindowTitle -like "*Minecraft*") { $h = $_.MainWindowHandle }
    }
}
if ($h -ne [IntPtr]::Zero) {
    $style = [Win32]::GetWindowLong($h, -16)
    $newStyle = $style -band (-bnot 0x00C40000)
    [Win32]::SetWindowLong($h, -16, $newStyle)
    [Win32]::SetWindowPos($h, [IntPtr]::Zero, 0, 0, ${width}, ${height}, 0x0040)
    [Win32]::SetForegroundWindow($h)
}
`;
                await execAsync(`powershell -ExecutionPolicy Bypass -Command "${psScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
                Logger.info('GameHandler', 'Borderless mode applied via Win32 APIs');
            }
            else if (process.platform === 'darwin') {
                // macOS: Use AppleScript to manipulate window
                const appleScript = `
tell application "System Events"
    set javaProcesses to every process whose name contains "java"
    repeat with proc in javaProcesses
        try
            set frontmost of proc to true
            set position of window 1 of proc to {0, 0}
            set size of window 1 of proc to {${width}, ${height}}
        end try
    end repeat
end tell
`;
                await execAsync(`osascript -e '${appleScript.replace(/'/g, "'\"'\"'")}'`);
                Logger.info('GameHandler', 'Borderless mode applied via AppleScript');
            }
            else if (process.platform === 'linux') {
                // Linux: Check session type and use appropriate tool
                const sessionType = process.env.XDG_SESSION_TYPE || 'x11';

                if (sessionType === 'x11') {
                    // X11: Use wmctrl for fullscreen
                    try {
                        // Try with window title first
                        await execAsync('wmctrl -r "Minecraft" -b add,fullscreen');
                        Logger.info('GameHandler', 'Borderless mode applied via wmctrl');
                    } catch (e) {
                        // Fallback: try to find any Java window
                        try {
                            await execAsync('wmctrl -r :ACTIVE: -b add,fullscreen');
                            Logger.info('GameHandler', 'Borderless mode applied via wmctrl (active window)');
                        } catch (e2) {
                            Logger.warn('GameHandler', 'wmctrl failed - is it installed? Run: sudo apt install wmctrl');
                        }
                    }
                } else {
                    // Wayland: Limited support - log warning
                    Logger.warn('GameHandler', 'Wayland detected - fullscreen borderless has limited support. Window may not cover top bar.');
                }
            }
        } catch (e: any) {
            Logger.error('GameHandler', `Failed to apply borderless mode: ${e.message}`);
        }
    }

    private async checkAndExtractInstance(): Promise<string | null> {
        const instanceDir = path.join(app.getPath('userData'), 'instances', 'default');
        const dataDir = app.getPath('userData');

        // Check if instance already exists
        if (fs.existsSync(path.join(instanceDir, 'instance.cfg'))) {
            console.log('Instance already exists, skipping extraction.');
            return instanceDir;
        }

        // Download instance.zip to userData if not present
        const instanceZip = path.join(dataDir, 'instance.zip');

        if (!fs.existsSync(instanceZip)) {
            console.log('instance.zip not found. Attempting to download from VPS...');
            // We need a sender to show progress, but checkAndExtractInstance doesn't have it passed usually.
            // For now, we'll log it. Ideally we refactor to pass sender.
            // Note: Since this is called before typical progress events, we might want to just blocking download.

            const vpsUrls = [
                'https://craft.blocky.com.br/launcher-assets/instance.zip'
            ];

            for (const vpsUrl of vpsUrls) {
                try {
                    console.log(`Trying to download instance.zip from ${vpsUrl}...`);
                    const response = await fetch(vpsUrl, { signal: AbortSignal.timeout(60000) }); // Increased timeout
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        // Validate ZIP magic bytes (PK\x03\x04)
                        if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B) {
                            fs.writeFileSync(instanceZip, buffer);
                            console.log('instance.zip downloaded successfully from', vpsUrl);
                            break; // Success, exit loop
                        } else {
                            console.warn(`Downloaded content from ${vpsUrl} is not a valid ZIP (got ${buffer.length} bytes, first bytes: ${buffer.slice(0, 20).toString('hex')})`);
                            // Continue to next URL
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to download instance.zip from ${vpsUrl}:`, e);
                    // Continue to next URL
                }
            }
        }

        if (fs.existsSync(instanceZip) && validateZipFile(instanceZip)) {
            console.log('Extracting instance.zip...');
            safeExtractZip(instanceZip, instanceDir);
            return instanceDir;
        }

        return null;
    }

    private async downloadFile(url: string, dest: string, filename: string, sender: Electron.WebContents) {
        this.sendProgress(sender, `Baixando ${filename}...`, 0);
        // Ensure directory exists
        fs.mkdirSync(dest, { recursive: true });
        const filePath = path.join(dest, filename);

        try {

            // If file exists, skip download (unless invalid size, checked later)
            if (fs.existsSync(filePath)) {
                return filePath;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);

            const total = Number(response.headers.get('content-length')) || 0;
            const fileStream = createWriteStream(filePath);

            if (!response.body) throw new Error('No body');

            // @ts-ignore - ReadableStream/Node stream mismatch
            const reader = response.body.getReader();
            let downloaded = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                fileStream.write(Buffer.from(value));
                downloaded += value.length;
                if (total > 0) {
                    this.sendProgress(sender, `Baixando ${filename}`, Math.round((downloaded / total) * 100));
                }
            }

            // Wait for the file stream to fully close (important for Windows)
            await new Promise<void>((resolve, reject) => {
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
                fileStream.end();
            });

            // Validate file size for jars (sanity check)
            const stats = fs.statSync(filePath);
            if (filename.endsWith('.jar') && stats.size < 100) {
                fs.unlinkSync(filePath);
                throw new Error(`Downloaded file ${filename} is too small (${stats.size} bytes). Likely invalid.`);
            }

            // Validate ZIP files
            if (filename.endsWith('.zip') && !validateZipFile(filePath)) {
                const buffer = fs.readFileSync(filePath);
                const firstBytes = buffer.slice(0, 20).toString('hex');
                fs.unlinkSync(filePath);
                throw new Error(`Downloaded file ${filename} is not a valid ZIP (first bytes: ${firstBytes}). Server may have returned an error page.`);
            }

            return filePath;
        } catch (e) {
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (delErr) { /* ignore */ }
            }
            throw new Error(`Download failed: ${e}`);
        }
    }

    private async handleLaunch(event: IpcMainInvokeEvent, options: GameOptions) {
        console.log('Requesting game launch...', options);

        // 0. Check for updates (with 60s cache to avoid duplicate checks)
        this.sendProgress(event.sender, 'Verificando atualizações...', 2);
        const now = Date.now();
        if (this.lastUpdateCheck && (now - this.lastUpdateCheck.timestamp) < this.UPDATE_CACHE_TTL) {
            console.log('[GameHandler] Using cached update check result (TTL: 60s)');
        } else {
            try {
                const updateResult = await this.updateManager.performAllUpdates((status, percent) => {
                    const mappedPercent = 2 + (percent / 100) * 13;
                    this.sendProgress(event.sender, status, Math.round(mappedPercent));
                });
                this.lastUpdateCheck = { result: updateResult, timestamp: now };

                if (!updateResult.success) {
                    console.warn('Update check failed, continuing anyway:', updateResult.error);
                }
            } catch (e) {
                console.warn('Update check failed, continuing anyway:', e);
            }
        }

        // 1. Check & Extract Custom Instance
        const instanceDir = await this.checkAndExtractInstance();
        const isCustomInstance = !!instanceDir;

        // Determine game Root
        // If Custom Instance, the game root is the extracted dir.
        // If Vanilla, it's userData/gamedata
        const gameRoot = instanceDir || this.gamePath;
        const dotMinecraft = isCustomInstance ? path.join(gameRoot, '.minecraft') : gameRoot;

        // Ensure .minecraft exists (created by zip or we create it)
        if (!fs.existsSync(dotMinecraft)) fs.mkdirSync(dotMinecraft, { recursive: true });

        // Clear remappedJars only if instance version changed (speeds up subsequent launches)
        const currentInstanceVersion = this.lastUpdateCheck?.result?.remoteVersions?.instance?.version;
        const sensitiveCache = path.join(dotMinecraft, '.fabric', 'remappedJars');
        if (currentInstanceVersion && currentInstanceVersion !== this.lastInstanceVersion) {
            if (fs.existsSync(sensitiveCache)) {
                console.log('[GameHandler] Instance version changed, clearing remappedJars cache...');
                fs.rmSync(sensitiveCache, { recursive: true, force: true });
            }
            this.lastInstanceVersion = currentInstanceVersion;
        } else {
            console.log('[GameHandler] Preserving remappedJars cache (same instance version)');
        }

        const binDir = path.join(dotMinecraft, 'bin');
        // IMPORTANT: Match PrismLauncher - natives at instance root, NOT inside .minecraft/bin/
        // The .minecraft path with dot may cause issues with LWJGL native loading on Windows
        const nativesDir = path.join(gameRoot, 'natives');
        const librariesDir = path.join(gameRoot, 'libraries'); // Store libs outside .minecraft usually, or inside

        try {
            // 2a. Download Vanilla Assets (Required for both)
            if (!options.username) throw new Error('Username required');

            // Ensure Java is available (auto-download if needed)
            this.sendProgress(event.sender, 'Verificando Java...', 5);
            try {
                this.javaPath = options.javaPath || await this.javaManager.ensureJava(event.sender);
            } catch (e: any) {
                throw new Error('Falha ao configurar Java: ' + e.message);
            }

            // Fetch Manifest (with 24h cache)
            this.sendProgress(event.sender, 'Verificando versão...', 65);
            const versionDetails = await this.getCachedVersionDetails();

            // Download Minecraft Jar
            const clientUrl = versionDetails.downloads.client.url;
            const mcJarPath = await this.downloadFile(clientUrl, binDir, 'minecraft.jar', event.sender);

            // Download LWJGL Natives (Simplified: just download standard b1.7.3 natives)
            // Note: Real launchers extract these from libraries. 
            // For b1.7.3, they are often in the version json libraries with "natives" classifier.
            // We will try to find and download them.
            if (!isCustomInstance) {
                this.sendProgress(event.sender, 'Baixando bibliotecas...', 70);

                // Determine platform-specific natives classifier
                let nativesClassifier = 'natives-linux';
                if (process.platform === 'win32') nativesClassifier = 'natives-windows';
                else if (process.platform === 'darwin') nativesClassifier = 'natives-osx';

                // Iterate libraries for natives
                for (const lib of versionDetails.libraries) {
                    if (lib.downloads && lib.downloads.classifiers && lib.downloads.classifiers[nativesClassifier]) {
                        const native = lib.downloads.classifiers[nativesClassifier];
                        // Download and unzip
                        // For simplicity in this demo, we assume we need to unzip them to bin/natives
                        // Implementation: Download zip to temp, unzip to nativesDir.

                        const tempNativePath = await this.downloadFile(native.url, path.join(gameRoot, 'temp_natives'), path.basename(native.path), event.sender);
                        // Validate and extract the native jar
                        if (validateZipFile(tempNativePath)) {
                            const zip = new AdmZip(tempNativePath);
                            zip.extractAllTo(nativesDir, true);
                        } else {
                            console.warn(`[GameHandler] Skipping invalid native file: ${tempNativePath}`);
                        }
                    }
                }

                // Ensure OpenAL is available (fallback for vanilla mode)
                // Legacy Fabric LWJGL uses OpenAL-amd64.dll / OpenAL-i386.dll naming
                const openalPath = path.join(nativesDir, process.platform === 'win32' ? 'OpenAL-amd64.dll' : 'libopenal.so');
                if (!fs.existsSync(openalPath)) {
                    console.log('[GameHandler] OpenAL not found, downloading from Legacy Fabric...');
                    this.sendProgress(event.sender, 'Baixando OpenAL...', 72);

                    let lwjglClassifier = 'natives-linux';
                    if (process.platform === 'win32') lwjglClassifier = 'natives-windows';
                    else if (process.platform === 'darwin') lwjglClassifier = 'natives-osx';

                    const lwjglNativeUrl = `https://repo.legacyfabric.net/repository/legacyfabric/org/lwjgl/lwjgl/lwjgl-platform/2.9.4+legacyfabric.9/lwjgl-platform-2.9.4+legacyfabric.9-${lwjglClassifier}.jar`;

                    try {
                        const tempLwjglPath = await this.downloadFile(lwjglNativeUrl, path.join(gameRoot, 'temp_natives'), `lwjgl-platform-${lwjglClassifier}.jar`, event.sender);
                        if (validateZipFile(tempLwjglPath)) {
                            const zip = new AdmZip(tempLwjglPath);
                            zip.extractAllTo(nativesDir, true);
                            console.log('[GameHandler] OpenAL natives extracted successfully');

                        }
                    } catch (e) {
                        console.warn('[GameHandler] Failed to download OpenAL natives:', e);
                    }
                }
            }

            // 2b. Handle Fabric/Custom Dependencies
            let classpath = [mcJarPath];
            let mainClass = 'net.minecraft.client.Minecraft';
            let tweakClass = '';

            if (isCustomInstance) {
                // Check mmc-pack.json for Fabric
                const mmcPath = path.join(instanceDir, 'mmc-pack.json');
                if (fs.existsSync(mmcPath)) {
                    const mmcPack = JSON.parse(fs.readFileSync(mmcPath, 'utf-8'));
                    const fabricComponent = mmcPack.components.find((c: any) => c.uid === 'net.fabricmc.fabric-loader');

                    if (fabricComponent) {
                        this.sendProgress(event.sender, 'Configurando Fabric/StationAPI...', 75);

                        const fabricLibs = [
                            // ASM (Required by Mixin)
                            { name: 'asm:9.7.1', group: 'org.ow2.asm', artifact: 'asm', version: '9.7.1' },
                            { name: 'asm-analysis:9.7.1', group: 'org.ow2.asm', artifact: 'asm-analysis', version: '9.7.1' },
                            { name: 'asm-commons:9.7.1', group: 'org.ow2.asm', artifact: 'asm-commons', version: '9.7.1' },
                            { name: 'asm-tree:9.7.1', group: 'org.ow2.asm', artifact: 'asm-tree', version: '9.7.1' },
                            { name: 'asm-util:9.7.1', group: 'org.ow2.asm', artifact: 'asm-util', version: '9.7.1' },
                            // Mixin
                            { name: 'sponge-mixin:0.15.3+mixin.0.8.7', group: 'net.fabricmc', artifact: 'sponge-mixin', version: '0.15.3+mixin.0.8.7' },
                            { name: 'mixinextras-fabric:0.4.1', group: 'io.github.llamalad7', artifact: 'mixinextras-fabric', version: '0.4.1' },
                            // Commons (Required by StationAPI/Fabric)
                            { name: 'commons-lang3:3.12.0', group: 'org.apache.commons', artifact: 'commons-lang3', version: '3.12.0' },
                            { name: 'commons-io:2.11.0', group: 'commons-io', artifact: 'commons-io', version: '2.11.0' },
                            { name: 'commons-codec:1.15', group: 'commons-codec', artifact: 'commons-codec', version: '1.15' },
                            // LWJGL/JInput (Prism/Babric Specific Versions)
                            { name: 'jutils:1.0.0', group: 'net.java.jutils', artifact: 'jutils', version: '1.0.0' },
                            { name: 'jinput:2.0.5', group: 'net.java.jinput', artifact: 'jinput', version: '2.0.5' },
                            { name: 'lwjgl:2.9.4+legacyfabric.9', group: 'org.lwjgl.lwjgl', artifact: 'lwjgl', version: '2.9.4+legacyfabric.9' },
                            { name: 'lwjgl_util:2.9.4+legacyfabric.9', group: 'org.lwjgl.lwjgl', artifact: 'lwjgl_util', version: '2.9.4+legacyfabric.9' },
                            // Logging (Prism uses these exact versions)
                            { name: 'log4j-api:2.16.0', group: 'org.apache.logging.log4j', artifact: 'log4j-api', version: '2.16.0' },
                            { name: 'log4j-core:2.16.0', group: 'org.apache.logging.log4j', artifact: 'log4j-core', version: '2.16.0' },
                            { name: 'log4j-slf4j18-impl:2.16.0', group: 'org.apache.logging.log4j', artifact: 'log4j-slf4j18-impl', version: '2.16.0' },
                            { name: 'terminalconsoleappender:1.2.0', group: 'net.minecrell', artifact: 'terminalconsoleappender', version: '1.2.0' },
                            // SLF4J (Prism uses 1.8.0-beta4)
                            { name: 'slf4j-api:1.8.0-beta4', group: 'org.slf4j', artifact: 'slf4j-api', version: '1.8.0-beta4' },
                            // Guava (Critical for modern Fabric/Mixin on older MC)
                            { name: 'guava:31.0.1-jre', group: 'com.google.guava', artifact: 'guava', version: '31.0.1-jre' },
                            { name: 'failureaccess:1.0.1', group: 'com.google.guava', artifact: 'failureaccess', version: '1.0.1' },
                            // GSON (Required by Fabric)
                            { name: 'gson:2.8.9', group: 'com.google.code.gson', artifact: 'gson', version: '2.8.9' },
                            // Babric Log4j Config (from Prism log)
                            { name: 'log4j-config:1.0.0', group: 'babric', artifact: 'log4j-config', version: '1.0.0' }
                        ];

                        const fabricBase = 'https://maven.fabricmc.net/';
                        const mavenCentral = 'https://repo1.maven.org/maven2/';
                        const legacyFabricRepo = 'https://repo.legacyfabric.net/repository/legacyfabric/';
                        const babricRepo = 'https://maven.glass-launcher.net/babric/';

                        // Libraries are downloaded directly from Maven repos (no VPS libraries.zip)
                        console.log('[GameHandler] Using Maven-based library downloads');
                        if (!fs.existsSync(librariesDir)) {
                            fs.mkdirSync(librariesDir, { recursive: true });
                        }

                        for (const lib of fabricLibs) {
                            const pathStr = `${lib.group.replace(/\./g, '/')}/${lib.artifact}/${lib.version}/${lib.artifact}-${lib.version}.jar`;
                            const localPath = path.join(librariesDir, `${lib.artifact}-${lib.version}.jar`);

                            // Check if already downloaded
                            if (fs.existsSync(localPath)) {
                                classpath.push(localPath);
                                continue;
                            }

                            // 2. Fallback to Download (Offline Mode fallback to online)
                            // Route to correct Maven repository based on group
                            let url = fabricBase + pathStr;

                            // Maven Central hosted libraries
                            const mavenCentralGroups = [
                                'org.apache', 'commons-io', 'commons-codec',
                                'net.java.jutils', 'net.java.jinput', 'org.ow2.asm',
                                'com.google.guava', 'com.google.code.gson', 'org.slf4j',
                                'io.github.llamalad7', 'net.minecrell'
                            ];
                            const isMavenCentral = mavenCentralGroups.some(g => lib.group.startsWith(g) || lib.group === g);

                            if (isMavenCentral) {
                                url = mavenCentral + pathStr;
                            } else if (lib.group.startsWith('org.lwjgl')) {
                                url = legacyFabricRepo + pathStr;
                            } else if (lib.group === 'babric') {
                                url = babricRepo + pathStr;
                            }

                            const libPath = await this.downloadFile(url, librariesDir, `${lib.artifact}-${lib.version}.jar`, event.sender);
                            classpath.push(libPath);
                        }

                        // Download Legacy Fabric Natives (Crucial for LWJGL 2.9.4+legacyfabric.9)
                        this.sendProgress(event.sender, 'Baixando nativos...', 78);

                        // Check if natives are already complete (skip extraction for faster startup)
                        const expectedNatives = process.platform === 'linux'
                            ? ['liblwjgl-linux-amd64.so', 'libopenal-amd64.so', 'libjinput-linux64.so']
                            : process.platform === 'win32'
                                ? ['lwjgl64.dll', 'OpenAL64.dll']
                                : ['liblwjgl.dylib', 'libopenal.dylib'];

                        const nativesComplete = fs.existsSync(nativesDir) &&
                            expectedNatives.every(f => fs.existsSync(path.join(nativesDir, f)));

                        if (nativesComplete) {
                            console.log('[GameHandler] Natives already present, skipping extraction');
                        } else {
                            // Clear and re-extract
                            if (fs.existsSync(nativesDir)) {
                                console.log('[GameHandler] Natives incomplete, clearing for fresh extraction...');
                                fs.rmSync(nativesDir, { recursive: true, force: true });
                            }
                            fs.mkdirSync(nativesDir, { recursive: true });

                            let classifier = 'natives-linux';
                            if (process.platform === 'win32') classifier = 'natives-windows';
                            else if (process.platform === 'darwin') classifier = 'natives-osx';

                            const nativesList = [
                                { group: 'org.lwjgl.lwjgl', artifact: 'lwjgl-platform', version: '2.9.4+legacyfabric.9', classifier: classifier },
                                { group: 'net.java.jinput', artifact: 'jinput-platform', version: '2.0.5', classifier: classifier }
                            ];

                            for (const native of nativesList) {
                                const filename = `${native.artifact}-${native.version}-${native.classifier}.jar`;
                                const pathStr = `${native.group.replace(/\./g, '/')}/${native.artifact}/${native.version}/${filename}`;
                                const localPath = path.join(librariesDir, filename);

                                // Check if already downloaded
                                if (fs.existsSync(localPath)) {
                                    console.log(`[Cache] Found native library locally: ${filename}`);
                                    await safeExtractZipWithRetry(localPath, nativesDir);
                                    continue;
                                }

                                // 2. Download if missing
                                let url = legacyFabricRepo + pathStr;
                                if (native.group === 'net.java.jinput') {
                                    url = mavenCentral + pathStr;
                                }

                                // Download to temp
                                const tempPath = await this.downloadFile(url, path.join(gameRoot, 'temp_natives'), filename, event.sender);

                                // Extract to nativesDir
                                await safeExtractZipWithRetry(tempPath, nativesDir);
                            }

                            // FIX: macOS .jnilib to .dylib renaming (Prism behavior)
                            if (process.platform === 'darwin') {
                                try {
                                    const files = fs.readdirSync(nativesDir);
                                    for (const file of files) {
                                        if (file.endsWith('.jnilib')) {
                                            const oldPath = path.join(nativesDir, file);
                                            const newPath = path.join(nativesDir, file.replace('.jnilib', '.dylib'));
                                            if (fs.existsSync(oldPath)) {
                                                console.log(`[GameHandler] Renaming ${file} to .dylib`);
                                                try {
                                                    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
                                                    fs.renameSync(oldPath, newPath);
                                                } catch (renameErr) {
                                                    console.warn(`[GameHandler] Failed to rename ${file}:`, renameErr);
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.warn('[GameHandler] Failed to process macOS natives:', e);
                                }
                            }

                            // NOTE: PrismLauncher works with the original OpenAL-amd64.dll files
                            // No need to download or rename. The fix is in using forward slashes
                            // in java.library.path and NOT using -Dorg.lwjgl.librarypath/openal.libname

                            // Log the contents of natives folder for debugging
                            try {
                                const nativesContents = fs.readdirSync(nativesDir);
                                console.log(`[GameHandler] Natives folder contents (${nativesDir}):`, nativesContents);
                            } catch (e) {
                                console.error('[GameHandler] Failed to read natives folder:', e);
                            }
                        } // End of else block for natives

                        // Download Fabric Loader (0.16.7)
                        const loaderUrl = 'https://maven.fabricmc.net/net/fabricmc/fabric-loader/0.16.7/fabric-loader-0.16.7.jar';
                        const loaderPath = await this.downloadFile(loaderUrl, librariesDir, 'fabric-loader-0.16.7.jar', event.sender);

                        // Intermediary b1.7.3 (Use Upstream to match Prism)
                        const intermediaryUrl = 'https://maven.glass-launcher.net/babric/babric/intermediary-upstream/b1.7.3/intermediary-upstream-b1.7.3.jar';
                        const intermediaryPath = await this.downloadFile(intermediaryUrl, librariesDir, 'intermediary-upstream-b1.7.3.jar', event.sender);

                        // Add to classpath
                        classpath.push(loaderPath);
                        classpath.push(intermediaryPath);

                        // Overwrite Main Class
                        mainClass = 'net.fabricmc.loader.impl.launch.knot.KnotClient';

                        // REORDERING CLASSPATH TO MATCH PRISM
                        // We want: [Libraries..., Loader, Intermediary, ClientJar]
                        // Remove mcJarPath from its current position (ignoring where it is) and append it to end.
                        const newClasspath = [];
                        for (const p of classpath) {
                            if (p !== mcJarPath) newClasspath.push(p);
                        }
                        newClasspath.push(mcJarPath);
                        classpath = newClasspath;






                    }
                }
            }

            // Add LWJGL to classpath
            // Note: For Beta 1.7.3, we need jinput, lwjgl, lwjgl_util. 
            // We need to fetch these jars.
            // Simplified: use versionDetails to find them.
            if (!isCustomInstance) {
                for (const lib of versionDetails.libraries) {
                    if (lib.downloads && lib.downloads.artifact) {
                        const art = lib.downloads.artifact;
                        if (art.path.includes('lwjgl') || art.path.includes('jinput')) {
                            const libPath = await this.downloadFile(art.url, binDir, path.basename(art.path), event.sender);
                            classpath.push(libPath);
                        }
                    }
                }
            }

            // 3. Launch
            this.sendProgress(event.sender, 'Iniciando Jogo...', 95);

            // Memory settings from user config
            const minMem = options.settings?.minMemory || '512';
            const maxMem = options.settings?.maxMemory || '2048';
            const customArgs = options.settings?.javaArgs || '';

            // Find OpenAL library for -Dorg.lwjgl.openal.libname property
            let openalLibPath = '';
            try {
                if (fs.existsSync(nativesDir)) {
                    const nativesFiles = fs.readdirSync(nativesDir);
                    // Prioritize specific names based on platform
                    const priorities = process.platform === 'win32'
                        ? ['OpenAL64.dll', 'OpenAL32.dll', 'OpenAL-amd64.dll', 'OpenAL-i386.dll', 'OpenAL.dll']
                        : process.platform === 'darwin'
                            ? ['libopenal.dylib', 'openal.dylib']
                            : ['libopenal.so', 'libopenal-amd64.so', 'libopenal-i386.so'];

                    for (const p of priorities) {
                        if (nativesFiles.includes(p)) {
                            // Use native path separators - don't convert to forward slashes on Windows
                            openalLibPath = path.join(nativesDir, p);
                            console.log(`[GameHandler] Found OpenAL library: ${openalLibPath}`);
                            break;
                        }
                    }

                    // Fallback: search for anything containing "openal"
                    if (!openalLibPath) {
                        const found = nativesFiles.find(f => f.toLowerCase().includes('openal') && (f.endsWith('.dll') || f.endsWith('.so') || f.endsWith('.dylib')));
                        if (found) {
                            openalLibPath = path.join(nativesDir, found);
                            console.log(`[GameHandler] Found OpenAL library (fallback): ${openalLibPath}`);
                        }
                    }
                }
            } catch (e) {
                console.warn('[GameHandler] Failed to scan for OpenAL lib:', e);
            }

            // Base launch args - Matching PrismLauncher configuration
            // IMPORTANT: Use NATIVE path separators (Backslashes on Windows)
            // PrismLauncher logs show forward slashes but likely uses backslashes internally for the actual process spawn on Windows
            const resourcesPath = path.join(dotMinecraft, 'resources');

            const launchArgs: string[] = [
                `-Xms${minMem}M`,
                `-Xmx${maxMem}M`,
                // Use native path separators
                '-Djava.library.path=' + nativesDir,
                '-Dfabric.gameJarPath=' + mcJarPath,
                '-Dfabric.gameVersion=b1.7.3',
                '-Dfabric.envType=client',
                // Suppress SLF4J "no providers" warning
                '-Dslf4j.internal.verbosity=ERROR',
                // Disable legacy resource downloads from defunct S3 bucket
                '-Dminecraft.resources.index=' + resourcesPath,
                '-Dminecraft.applet.TargetDirectory=' + dotMinecraft,
                '-Dminecraft.applet.BaseURL=file:///',
            ];

            // Add custom JVM arguments from settings (if any)
            if (customArgs.trim()) {
                const customArgsArray = customArgs.trim().split(/\s+/).filter(arg => arg.length > 0);
                launchArgs.push(...customArgsArray);
            }

            // Borderless window mode (experimental) - removes window decorations for overlay compatibility
            if (options.settings?.borderlessMode) {
                console.log('[GameHandler] Borderless mode enabled - adding LWJGL undecorated flag');
                launchArgs.push('-Dorg.lwjgl.opengl.Window.undecorated=true');
            }

            // Add classpath and main class
            launchArgs.push('-cp', classpath.join(path.delimiter));
            launchArgs.push(mainClass);

            // Game Args
            launchArgs.push('--username', options.username);
            launchArgs.push('--gameDir', dotMinecraft);
            launchArgs.push('--assetsDir', path.join(dotMinecraft, 'resources')); // Old resources logic

            if (isCustomInstance && mainClass.includes('KnotClient')) {
                launchArgs.push('--assetIndex', 'truly_legacy'); // Babric often uses 'truly_legacy' or 'legacy'?
                // Actually, standard b1.7.3 uses 'legacy' assets, but Fabric might want an index argument.
                // Let's guess 'legacy' for now.
            }

            // Borderless mode: set window size to screen dimensions for pseudo-fullscreen
            if (options.settings?.borderlessMode) {
                try {
                    const primaryDisplay = screen.getPrimaryDisplay();
                    const { width, height } = primaryDisplay.size;
                    console.log(`[GameHandler] Borderless mode: setting window size to ${width}x${height}`);
                    launchArgs.push('--width', width.toString());
                    launchArgs.push('--height', height.toString());
                } catch (e) {
                    console.warn('[GameHandler] Failed to get screen size for borderless mode:', e);
                    // Fallback to common resolution
                    launchArgs.push('--width', '1920');
                    launchArgs.push('--height', '1080');
                }
            }

            // Auto-connect to BlockyCRAFT server
            launchArgs.push('--server', '185.100.215.195');
            launchArgs.push('--port', '25565');



            console.log('Spawning java:', this.javaPath);
            console.log('Args:', launchArgs);

            // Prepare environment variables
            const gameEnv = { ...process.env };

            // Configure OpenAL Soft for Linux ONLY
            // Setting this on Windows breaks OpenAL if openal-soft tries to load linux backends
            if (process.platform === 'linux') {
                // Increase OpenAL buffer size to prevent timing warnings
                gameEnv.ALSOFT_CONF = 'period_size=2048';
                // Prefer PulseAudio/PipeWire backend
                gameEnv.ALSOFT_DRIVERS = 'pulse,alsa,oss';
            }

            // On Windows, add natives to PATH to help LWJGL find the DLLs
            if (process.platform === 'win32') {
                // Find existing Path key (case-insensitive)
                const pathKey = Object.keys(gameEnv).find(k => k.toLowerCase() === 'path') || 'Path';
                // Append nativesDir to PATH
                gameEnv[pathKey] = nativesDir + path.delimiter + (gameEnv[pathKey] || '');
                console.log('[GameHandler] Updated PATH with natives:', nativesDir);
            }

            this.gameProcess = spawn(this.javaPath, launchArgs, {
                cwd: dotMinecraft,
                env: gameEnv
            });

            // Notify overlay that game is now running
            const overlayHandler = getOverlayHandler();
            if (overlayHandler) {
                overlayHandler.setGameRunning(true);
            }

            // Apply borderless fullscreen mode if enabled (async, doesn't block)
            if (options.settings?.borderlessMode) {
                this.applyBorderlessPostSpawn().catch(e => {
                    Logger.error('GameHandler', `Borderless post-spawn failed: ${e.message}`);
                });
            }

            // Filter patterns for known harmless messages
            const suppressedPatterns = [
                's3.amazonaws.com/MinecraftResources',
                'Failed to add pack.mcmeta',
                'Failed to add READ_ME_I_AM_VERY_IMPORTANT'
            ];

            this.gameProcess.stdout.on('data', (data: any) => {
                const log = data.toString().trim();
                if (!log) return;

                // Always log to game file
                Logger.game('stdout', log);

                // Skip suppressed messages for console
                if (suppressedPatterns.some(pattern => log.includes(pattern))) {
                    return;
                }

                console.log(`[MC]: ${log}`);

                // Check for successful client startup/connection to switch UI
                if (log.includes('Connecting to')) {
                    event.sender.send('game-connected');
                }
            });

            this.gameProcess.stderr.on('data', (data: any) => {
                const log = data.toString().trim();
                if (!log) return;

                // Always log to game file
                Logger.game('stderr', log);

                // Skip suppressed messages for console
                if (suppressedPatterns.some(pattern => log.includes(pattern))) {
                    return;
                }

                console.error(`[MC-Err]: ${log}`);
            });

            this.gameProcess.on('close', (code: any) => {
                Logger.info('GameHandler', `Minecraft exited with code ${code}`);
                console.log(`Minecraft exited with code ${code}`);
                this.sendProgress(event.sender, 'Jogo fechado', 100);
                this.gameProcess = null;
                event.sender.send('game-closed', code);

                // Notify overlay that game has stopped
                const overlayHandler = getOverlayHandler();
                if (overlayHandler) {
                    overlayHandler.setGameRunning(false);
                }
            });

            return { success: true };

        } catch (e: any) {
            console.error('Launch failed:', e);
            this.sendProgress(event.sender, `Erro: ${e.message}`, 0);
            return { success: false, error: e.message, stack: e.stack };
        }
    }


    // End of class (Removed unused methods: getVersionDetails, downloadLibraries, spawnGameProcess, old downloadFile)
    private async handleUpdateCheck() {
        try {
            const updateCheck = await this.updateManager.checkForUpdates();

            if (!updateCheck.remoteVersions) {
                return { available: false, error: 'Failed to fetch version info' };
            }

            const hasContentUpdates = updateCheck.instanceUpdate ||
                updateCheck.librariesUpdate ||
                updateCheck.modsUpdate;

            if (hasContentUpdates || updateCheck.launcherUpdate) {
                return {
                    available: true,
                    launcherUpdate: updateCheck.launcherUpdate,
                    launcherDownloadUrl: updateCheck.launcherDownloadUrl,
                    instanceUpdate: updateCheck.instanceUpdate,
                    librariesUpdate: updateCheck.librariesUpdate,
                    modsUpdate: updateCheck.modsUpdate,
                    notes: updateCheck.remoteVersions.mods?.notes || 'Atualizações disponíveis'
                };
            }

            return { available: false };
        } catch (e) {
            console.error('Update check failed:', e);
            return { available: false, error: String(e) };
        }
    }

    private async handlePerformUpdate(event: IpcMainInvokeEvent) {
        try {
            const result = await this.updateManager.performAllUpdates((status, percent) => {
                this.sendProgress(event.sender, status, percent);
            });

            return result;
        } catch (e) {
            console.error('Update failed:', e);
            this.sendProgress(event.sender, `Erro na atualização: ${e}`, 0);
            return { success: false, error: String(e) };
        }
    }
}
