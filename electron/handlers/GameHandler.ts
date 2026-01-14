import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import AdmZip from 'adm-zip';
import { createWriteStream } from 'fs';
import { JavaManager } from './JavaManager.js';
import { UpdateManager } from './UpdateManager.js';
import { Logger } from './Logger.js';

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
    private gameProcess: any = null; // ChildProcess type but avoiding import issues for now if needed, or better explicit.

    constructor() {
        this.gamePath = path.join(app.getPath('userData'), 'gamedata');
        this.javaPath = 'java'; // Will be set by JavaManager
        this.javaManager = new JavaManager();
        this.updateManager = new UpdateManager();
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

    private async checkJava(path: string): Promise<boolean> {
        try {
            await execAsync(`"${path}" -version`);
            return true;
        } catch (e) {
            return false;
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
                'https://marina.rodrigorocha.art.br/launcher-assets/instance.zip',
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

        // 0. Check for updates first
        this.sendProgress(event.sender, 'Verificando atualizações...', 2);
        try {
            const updateResult = await this.updateManager.performAllUpdates((status, percent) => {
                // Map update progress to 2-15% of total progress
                const mappedPercent = 2 + (percent / 100) * 13;
                this.sendProgress(event.sender, status, Math.round(mappedPercent));
            });

            if (!updateResult.success) {
                console.warn('Update check failed, continuing anyway:', updateResult.error);
            }
        } catch (e) {
            console.warn('Update check failed, continuing anyway:', e);
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

        // FORCE CACHE CLEAR: Delete .fabric/remappedJars to ensure fresh remapping
        const sensitiveCache = path.join(dotMinecraft, '.fabric', 'remappedJars');
        if (fs.existsSync(sensitiveCache)) {
            console.log('Clearing remappedJars cache to force fresh map...');
            fs.rmSync(sensitiveCache, { recursive: true, force: true });
        }

        const binDir = path.join(dotMinecraft, 'bin');
        const nativesDir = path.join(binDir, 'natives');
        const librariesDir = path.join(gameRoot, 'libraries'); // Store libs outside .minecraft usually, or inside

        // Fix OpenAL DLL naming for Windows (run on every launch)
        // Legacy Fabric uses 'OpenAL-amd64.dll' but LWJGL 2.x expects 'OpenAL64.dll'
        if (process.platform === 'win32' && fs.existsSync(nativesDir)) {
            const openalRenames = [
                { from: 'OpenAL-amd64.dll', to: 'OpenAL64.dll' },
                { from: 'OpenAL-i386.dll', to: 'OpenAL32.dll' },
                { from: 'OpenAL-aarch64.dll', to: 'OpenAL64.dll' }
            ];
            for (const rename of openalRenames) {
                const srcPath = path.join(nativesDir, rename.from);
                const destPath = path.join(nativesDir, rename.to);
                if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
                    console.log(`[GameHandler] Fixing OpenAL: ${rename.from} -> ${rename.to}`);
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        }

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

            // Fetch Manifest (Vanilla)
            this.sendProgress(event.sender, 'Verificando versão...', 65);
            const manifestRes = await fetch(VERSION_MANIFEST_URL);
            const manifest = await manifestRes.json() as any;
            const versionData = manifest.versions.find((v: any) => v.id === TARGET_VERSION_ID);
            if (!versionData) throw new Error(`Version ${TARGET_VERSION_ID} not found`);

            const versionDetailsRes = await fetch(versionData.url);
            const versionDetails = await versionDetailsRes.json() as any;

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
                // The Mojang natives may not include OpenAL, so download from Legacy Fabric
                const openalPath = path.join(nativesDir, process.platform === 'win32' ? 'OpenAL64.dll' : 'libopenal.so');
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

                            // Rename OpenAL DLLs for Windows
                            if (process.platform === 'win32') {
                                const openalRenames = [
                                    { from: 'OpenAL-amd64.dll', to: 'OpenAL64.dll' },
                                    { from: 'OpenAL-i386.dll', to: 'OpenAL32.dll' }
                                ];
                                for (const rename of openalRenames) {
                                    const srcPath = path.join(nativesDir, rename.from);
                                    const destPath = path.join(nativesDir, rename.to);
                                    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
                                        console.log(`[GameHandler] Renaming ${rename.from} -> ${rename.to}`);
                                        fs.copyFileSync(srcPath, destPath);
                                    }
                                }
                            }
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
                            { name: 'asm:9.7.1', group: 'org.ow2.asm', artifact: 'asm', version: '9.7.1' },
                            { name: 'asm-analysis:9.7.1', group: 'org.ow2.asm', artifact: 'asm-analysis', version: '9.7.1' },
                            { name: 'asm-commons:9.7.1', group: 'org.ow2.asm', artifact: 'asm-commons', version: '9.7.1' },
                            { name: 'asm-tree:9.7.1', group: 'org.ow2.asm', artifact: 'asm-tree', version: '9.7.1' },
                            { name: 'asm-util:9.7.1', group: 'org.ow2.asm', artifact: 'asm-util', version: '9.7.1' },
                            { name: 'sponge-mixin:0.15.3+mixin.0.8.7', group: 'net.fabricmc', artifact: 'sponge-mixin', version: '0.15.3+mixin.0.8.7' },
                            // Commons (Required by StationAPI/Fabric)
                            { name: 'commons-lang3:3.12.0', group: 'org.apache.commons', artifact: 'commons-lang3', version: '3.12.0' },
                            { name: 'commons-io:2.11.0', group: 'commons-io', artifact: 'commons-io', version: '2.11.0' },
                            { name: 'commons-codec:1.15', group: 'commons-codec', artifact: 'commons-codec', version: '1.15' },
                            // LWJGL/JInput (Prism/Babric Specific Versions)
                            { name: 'jutils:1.0.0', group: 'net.java.jutils', artifact: 'jutils', version: '1.0.0' },
                            { name: 'jinput:2.0.5', group: 'net.java.jinput', artifact: 'jinput', version: '2.0.5' },
                            { name: 'lwjgl:2.9.4+legacyfabric.9', group: 'org.lwjgl.lwjgl', artifact: 'lwjgl', version: '2.9.4+legacyfabric.9' },
                            { name: 'lwjgl_util:2.9.4+legacyfabric.9', group: 'org.lwjgl.lwjgl', artifact: 'lwjgl_util', version: '2.9.4+legacyfabric.9' },

                            // Log4j 2 (Required by many Fabric mods/Loader)
                            { name: 'log4j-api:2.22.1', group: 'org.apache.logging.log4j', artifact: 'log4j-api', version: '2.22.1' },
                            { name: 'log4j-core:2.22.1', group: 'org.apache.logging.log4j', artifact: 'log4j-core', version: '2.22.1' },
                            // Guava (Critical for modern Fabric/Mixin on older MC)
                            { name: 'guava:31.0.1-jre', group: 'com.google.guava', artifact: 'guava', version: '31.0.1-jre' },
                            { name: 'failureaccess:1.0.1', group: 'com.google.guava', artifact: 'failureaccess', version: '1.0.1' },
                            // SLF4J (Required by StationAPI)
                            { name: 'slf4j-api:2.0.16', group: 'org.slf4j', artifact: 'slf4j-api', version: '2.0.16' }
                        ];

                        const fabricBase = 'https://maven.fabricmc.net/';
                        const mavenCentral = 'https://repo1.maven.org/maven2/';
                        const legacyFabricRepo = 'https://repo.legacyfabric.net/repository/legacyfabric/';

                        // 0. Check for bundled libraries.zip and extract if needed
                        // Skip if UpdateManager already extracted libraries (check for v2 marker or existing maven structure)
                        const markerV2 = path.join(librariesDir, '.bundled_extracted_v2');
                        const markerV1 = path.join(librariesDir, '.bundled_extracted_v1');
                        const asmExists = path.join(librariesDir, 'org', 'ow2', 'asm', 'asm', '9.7.1', 'asm-9.7.1.jar');

                        const librariesAlreadyExtracted = fs.existsSync(markerV2) || fs.existsSync(markerV1) || fs.existsSync(asmExists);

                        if (!librariesAlreadyExtracted) {
                            let bundledLibsZip = path.join(app.getPath('userData'), 'libraries.zip');

                            // DOWNLOAD libraries.zip IF MISSING (VPS Support - only if UpdateManager didn't handle it)
                            if (!fs.existsSync(bundledLibsZip)) {
                                console.log('libraries.zip not found locally. Attempting to download from VPS...');
                                this.sendProgress(event.sender, 'Baixando bibliotecas do servidor...', 68);

                                const libsUrls = [
                                    'https://marina.rodrigorocha.art.br/launcher-assets/libraries.zip',
                                    'https://craft.blocky.com.br/launcher-assets/libraries.zip'
                                ];

                                let downloaded = false;
                                for (const vpsUrl of libsUrls) {
                                    try {
                                        console.log(`Trying to download libraries.zip from ${vpsUrl}...`);
                                        await this.downloadFile(vpsUrl, path.dirname(bundledLibsZip), 'libraries.zip', event.sender);
                                        downloaded = true;
                                        break; // Success, exit loop
                                    } catch (e) {
                                        console.warn(`Failed to download libraries.zip from ${vpsUrl}:`, e);
                                        // Continue to next URL
                                    }
                                }

                                if (!downloaded) {
                                    console.error('Failed to download libraries.zip from all sources. Game might crash if libraries are missing.');
                                }
                            }

                            if (fs.existsSync(bundledLibsZip)) {
                            // Extract if we haven't marked it as extracted
                                this.sendProgress(event.sender, 'Extraindo bibliotecas locais (libraries.zip)...', 72);
                                console.log('Found libraries.zip, extracting...');
                                try {
                                    if (!fs.existsSync(librariesDir)) fs.mkdirSync(librariesDir, { recursive: true });
                                    safeExtractZip(bundledLibsZip, librariesDir);
                                    fs.writeFileSync(markerV1, 'extracted');
                                    console.log('Libraries extracted successfully.');
                                } catch (e) {
                                    console.error('Failed to extract libraries.zip:', e);
                                }
                            }
                        } else {
                            console.log('[GameHandler] Libraries already extracted by UpdateManager, skipping legacy download');
                        }

                        for (const lib of fabricLibs) {
                            const pathStr = `${lib.group.replace(/\./g, '/')}/${lib.artifact}/${lib.version}/${lib.artifact}-${lib.version}.jar`;

                            // 1. Check Local Existence
                            // a) Check flat structure (if downloaded previously)
                            const flatDest = path.join(librariesDir, `${lib.artifact}-${lib.version}.jar`);
                            if (fs.existsSync(flatDest)) {
                                classpath.push(flatDest);
                                continue;
                            }

                            // b) Check Maven structure (from libraries.zip extraction)
                            // The zip often contains 'libraries/com/...' so we check that relative to librariesDir
                            const mavenDest = path.join(librariesDir, 'libraries', pathStr);
                            if (fs.existsSync(mavenDest)) {
                                console.log(`[Cache] Found library (maven struct): ${lib.artifact}`);
                                classpath.push(mavenDest);
                                continue;
                            }

                            // c) Check Maven structure (direct, if zip was just com/...)
                            const mavenDirect = path.join(librariesDir, pathStr);
                            if (fs.existsSync(mavenDirect)) {
                                console.log(`[Cache] Found library (direct maven): ${lib.artifact}`);
                                classpath.push(mavenDirect);
                                continue;
                            }

                            // 2. Fallback to Download (Offline Mode fallback to online)
                            // Try Fabric Maven first, then Maven Central, then Legacy Fabric
                            let url = fabricBase + pathStr;

                            if (lib.group.startsWith('org.apache') || lib.group === 'commons-io' || lib.group === 'commons-codec' || lib.group === 'net.java.jutils' || lib.group === 'net.java.jinput' || lib.group.startsWith('org.ow2.asm') || lib.group.startsWith('com.google.guava') || lib.group.startsWith('org.slf4j')) {
                                url = mavenCentral + pathStr;
                            } else if (lib.group.startsWith('org.lwjgl')) {
                                url = legacyFabricRepo + pathStr;
                            }

                            const libPath = await this.downloadFile(url, librariesDir, `${lib.artifact}-${lib.version}.jar`, event.sender);
                            classpath.push(libPath);
                        }

                        // Download Legacy Fabric Natives (Crucial for LWJGL 2.9.4+legacyfabric.9)
                        this.sendProgress(event.sender, 'Baixando nativos...', 78);

                        let classifier = 'natives-linux';
                        if (process.platform === 'win32') classifier = 'natives-windows';
                        else if (process.platform === 'darwin') classifier = 'natives-osx';

                        const nativesList = [
                            { group: 'org.lwjgl.lwjgl', artifact: 'lwjgl-platform', version: '2.9.4+legacyfabric.9', classifier: classifier },
                            { group: 'net.java.jinput', artifact: 'jinput-platform', version: '2.0.5', classifier: classifier }
                        ];

                        for (const native of nativesList) {
                            const filename = `${native.artifact}-${native.version}-${native.classifier}.jar`;

                            // 1. Check if we already have this native jar (e.g. from libraries.zip)
                            // We check both flat and maven structure, similar to libraries
                            const pathStr = `${native.group.replace(/\./g, '/')}/${native.artifact}/${native.version}/${filename}`;
                            const flatPath = path.join(librariesDir, filename);
                            const mavenPath = path.join(librariesDir, 'libraries', pathStr);
                            const mavenDirect = path.join(librariesDir, pathStr);

                            let sourceZip = null;

                            if (fs.existsSync(flatPath)) sourceZip = flatPath;
                            else if (fs.existsSync(mavenPath)) sourceZip = mavenPath;
                            else if (fs.existsSync(mavenDirect)) sourceZip = mavenDirect;

                            if (sourceZip) {
                                console.log(`[Cache] Found native library locally: ${filename}`);
                                await safeExtractZipWithRetry(sourceZip, nativesDir);
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

                        // Fix OpenAL DLL naming for Windows
                        // Legacy Fabric uses 'OpenAL-amd64.dll' but LWJGL 2.x expects 'OpenAL64.dll'
                        if (process.platform === 'win32') {
                            const openalRenames = [
                                { from: 'OpenAL-amd64.dll', to: 'OpenAL64.dll' },
                                { from: 'OpenAL-i386.dll', to: 'OpenAL32.dll' },
                                { from: 'OpenAL-aarch64.dll', to: 'OpenAL64.dll' }
                            ];
                            for (const rename of openalRenames) {
                                const srcPath = path.join(nativesDir, rename.from);
                                const destPath = path.join(nativesDir, rename.to);
                                if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
                                    console.log(`[GameHandler] Renaming ${rename.from} -> ${rename.to}`);
                                    fs.copyFileSync(srcPath, destPath);
                                }
                            }
                        }

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

            // Base launch args
            const launchArgs: string[] = [
                `-Xms${minMem}M`,
                `-Xmx${maxMem}M`,
                '-Djava.library.path=' + nativesDir,
                '-Dorg.lwjgl.librarypath=' + nativesDir, // Fix for some lwjgl versions
                '-Dfabric.gameJarPath=' + mcJarPath,
                '-Dfabric.gameVersion=b1.7.3',
                '-Dfabric.envType=client',
                // Suppress SLF4J "no providers" warning
                '-Dslf4j.internal.verbosity=ERROR',
                // Disable legacy resource downloads from defunct S3 bucket
                '-Dminecraft.resources.index=' + path.join(dotMinecraft, 'resources'),
                '-Dminecraft.applet.TargetDirectory=' + dotMinecraft,
                '-Dminecraft.applet.BaseURL=file:///',
            ];

            // Add custom JVM arguments from settings (if any)
            if (customArgs.trim()) {
                const customArgsArray = customArgs.trim().split(/\s+/).filter(arg => arg.length > 0);
                launchArgs.push(...customArgsArray);
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

            // Auto-connect to BlockyCRAFT server
            launchArgs.push('--server', '185.100.215.195');
            launchArgs.push('--port', '25565');



            console.log('Spawning java:', this.javaPath);
            console.log('Args:', launchArgs);

            // Configure OpenAL Soft for better Linux audio compatibility
            const gameEnv = {
                ...process.env,
                // Increase OpenAL buffer size to prevent timing warnings
                ALSOFT_CONF: 'period_size=2048',
                // Prefer PulseAudio/PipeWire backend
                ALSOFT_DRIVERS: 'pulse,alsa,oss',
            };

            this.gameProcess = spawn(this.javaPath, launchArgs, {
                cwd: dotMinecraft,
                env: gameEnv
            });

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

            const hasUpdates = updateCheck.instanceUpdate ||
                updateCheck.librariesUpdate ||
                updateCheck.modsUpdate;

            if (hasUpdates) {
                return {
                    available: true,
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
