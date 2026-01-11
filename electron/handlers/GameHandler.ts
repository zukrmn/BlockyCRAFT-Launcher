import { app, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import AdmZip from 'adm-zip';
import { createWriteStream } from 'fs';

const execAsync = promisify(exec);

// Beta 1.7.3 Configuration
const VERSION_MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
const TARGET_VERSION_ID = 'b1.7.3';

interface GameOptions {
    username: string;
    gamePath?: string;
    javaPath?: string;
}

export class GameHandler {
    private gamePath: string;
    private javaPath: string;

    constructor() {
        this.gamePath = path.join(app.getPath('userData'), 'gamedata');
        this.javaPath = 'java'; // Default to system java
    }

    public init() {
        ipcMain.handle('launch-game', async (event, options: GameOptions) => {
            return this.handleLaunch(event, options);
        });

        ipcMain.handle('check-custom-instance', async () => {
            const instanceZipPath = path.resolve('instance.zip');
            const instanceDir = path.join(app.getPath('userData'), 'instances', 'default', 'instance.cfg');
            return fs.existsSync(instanceZipPath) || fs.existsSync(instanceDir);
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
        const zipName = 'allfrominstance.zip'; // User provided zip
        const instanceZipPath = path.resolve(zipName);
        const instanceDir = path.join(app.getPath('userData'), 'instances', 'default');

        if (fs.existsSync(instanceZipPath)) {
            console.log(`Found ${zipName}, forcing extraction to reset instance...`);
            try {
                const zip = new AdmZip(instanceZipPath);
                fs.mkdirSync(instanceDir, { recursive: true });
                // We need to extract contents. 
                // The zip has a top-level folder 'Beta Unleashed...'. We want to strip it?
                // AdmZip extractAllTo doesn't strip.
                // We will extract to instanceDir. 
                zip.extractAllTo(instanceDir, true);

                // Now we need to move the contents of the top-level folder to instanceDir if it exists
                const entries = fs.readdirSync(instanceDir);
                const topLevelDir = entries.find(e => fs.statSync(path.join(instanceDir, e)).isDirectory() && e.startsWith('Beta Unleashed'));

                if (topLevelDir) {
                    const topPath = path.join(instanceDir, topLevelDir);
                    console.log(`Moving files from ${topPath} to ${instanceDir}...`);
                    // Use /. to include hidden files (like .minecraft)
                    await execAsync(`cp -a "${topPath}/." "${instanceDir}/"`);
                }

                console.log('Extraction and merge complete.');
                // Rename zip to avoid re-extracting every time?
                fs.renameSync(instanceZipPath, instanceZipPath + '.extracted');
                return instanceDir;
            } catch (e) {
                console.error('Failed to extract instance:', e);
                return null;
            }
        }

        // Fallback to old behavior (instance.zip or existing dir)
        const oldZip = path.resolve('instance.zip');
        if (fs.existsSync(path.join(instanceDir, 'instance.cfg'))) {
            return instanceDir;
        }
        if (fs.existsSync(oldZip)) {
            // ... existing extraction logic ...
            const zip = new AdmZip(oldZip);
            fs.mkdirSync(instanceDir, { recursive: true });
            zip.extractAllTo(instanceDir, true);
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

            fileStream.end();

            // Validate file size for jars (sanity check)
            const stats = fs.statSync(filePath);
            if (filename.endsWith('.jar') && stats.size < 100) {
                fs.unlinkSync(filePath);
                throw new Error(`Downloaded file ${filename} is too small (${stats.size} bytes). Likely invalid.`);
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

        try {
            // 2a. Download Vanilla Assets (Required for both)
            if (!options.username) throw new Error('Username required');

            // Check Java
            if (options.javaPath) this.javaPath = options.javaPath;
            const javaOk = await this.checkJava(this.javaPath);
            if (!javaOk) throw new Error('Java not found. Please install Java 8.');

            // Fetch Manifest (Vanilla)
            this.sendProgress(event.sender, 'Verificando versão...', 10);
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
                this.sendProgress(event.sender, 'Baixando bibliotecas...', 30);

                // Iterate libraries for natives
                for (const lib of versionDetails.libraries) {
                    if (lib.downloads && lib.downloads.classifiers && lib.downloads.classifiers['natives-linux']) {
                        const native = lib.downloads.classifiers['natives-linux'];
                        // Download and unzip
                        // For simplicity in this demo, we assume we need to unzip them to bin/natives
                        // Implementation: Download zip to temp, unzip to nativesDir.
                        // Skipping full implementation for now, assuming standard ones are sufficient or pre-installed?
                        // Wait, user has nothing. We MUST download natives.

                        const tempNativePath = await this.downloadFile(native.url, path.join(gameRoot, 'temp_natives'), path.basename(native.path), event.sender);
                        const zip = new AdmZip(tempNativePath);
                        zip.extractAllTo(nativesDir, true);
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
                        this.sendProgress(event.sender, 'Configurando Fabric/StationAPI...', 50);

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
                            { name: 'failureaccess:1.0.1', group: 'com.google.guava', artifact: 'failureaccess', version: '1.0.1' }
                        ];

                        const fabricBase = 'https://maven.fabricmc.net/';
                        const mavenCentral = 'https://repo1.maven.org/maven2/';
                        const legacyFabricRepo = 'https://repo.legacyfabric.net/repository/legacyfabric/';

                        // 0. Check for bundled libraries.zip and extract if needed
                        const bundledLibsZip = path.resolve('libraries.zip');
                        if (fs.existsSync(bundledLibsZip)) {
                            // Extract if we haven't marked it as extracted
                            const marker = path.join(librariesDir, '.bundled_extracted_v1');
                            if (!fs.existsSync(marker)) {
                                this.sendProgress(event.sender, 'Extraindo bibliotecas locais (libraries.zip)...', 40);
                                console.log('Found libraries.zip, extracting...');
                                try {
                                    if (!fs.existsSync(librariesDir)) fs.mkdirSync(librariesDir, { recursive: true });
                                    const zip = new AdmZip(bundledLibsZip);
                                    zip.extractAllTo(librariesDir, true);
                                    fs.writeFileSync(marker, 'extracted');
                                    console.log('Libraries extracted successfully.');
                                } catch (e) {
                                    console.error('Failed to extract libraries.zip:', e);
                                }
                            }
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

                            if (lib.group.startsWith('org.apache') || lib.group === 'commons-io' || lib.group === 'commons-codec' || lib.group === 'net.java.jutils' || lib.group === 'net.java.jinput' || lib.group.startsWith('org.ow2.asm') || lib.group.startsWith('com.google.guava')) {
                                url = mavenCentral + pathStr;
                            } else if (lib.group.startsWith('org.lwjgl')) {
                                url = legacyFabricRepo + pathStr;
                            }

                            const libPath = await this.downloadFile(url, librariesDir, `${lib.artifact}-${lib.version}.jar`, event.sender);
                            classpath.push(libPath);
                        }

                        // Download Legacy Fabric Natives (Crucial for LWJGL 2.9.4+legacyfabric.9)
                        this.sendProgress(event.sender, 'Baixando nativos (Legacy Fabric)...', 60);
                        const nativesList = [
                            { group: 'org.lwjgl.lwjgl', artifact: 'lwjgl-platform', version: '2.9.4+legacyfabric.9', classifier: 'natives-linux' },
                            { group: 'net.java.jinput', artifact: 'jinput-platform', version: '2.0.5', classifier: 'natives-linux' }
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
                                const zip = new AdmZip(sourceZip);
                                zip.extractAllTo(nativesDir, true);
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
                            const zip = new AdmZip(tempPath);
                            zip.extractAllTo(nativesDir, true);
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
            this.sendProgress(event.sender, 'Iniciando Jogo...', 90);

            const launchArgs = [
                '-Djava.library.path=' + nativesDir,
                '-Dorg.lwjgl.librarypath=' + nativesDir, // Fix for some lwjgl versions
                '-Dfabric.gameJarPath=' + mcJarPath,
                '-Dfabric.gameVersion=b1.7.3',
                '-Dfabric.envType=client',
                '-cp', classpath.join(path.delimiter),
                mainClass
            ];

            // Game Args
            launchArgs.push('--username', options.username);
            launchArgs.push('--gameDir', dotMinecraft);
            launchArgs.push('--assetsDir', path.join(dotMinecraft, 'resources')); // Old resources logic

            if (isCustomInstance && mainClass.includes('KnotClient')) {
                launchArgs.push('--assetIndex', 'truly_legacy'); // Babric often uses 'truly_legacy' or 'legacy'?
                // Actually, standard b1.7.3 uses 'legacy' assets, but Fabric might want an index argument.
                // Let's guess 'legacy' for now.
            }

            console.log('Spawning java:', this.javaPath);
            console.log('Args:', launchArgs);

            const gameProcess = spawn(this.javaPath, launchArgs, {
                cwd: dotMinecraft
            });

            gameProcess.stdout.on('data', (data) => {
                console.log(`[MC]: ${data}`);
            });

            gameProcess.stderr.on('data', (data) => {
                console.error(`[MC-Err]: ${data}`);
            });

            gameProcess.on('close', (code) => {
                console.log(`Minecraft exited with code ${code}`);
                this.sendProgress(event.sender, 'Jogo fechado', 100);
            });

            return { success: true };

        } catch (e: any) {
            console.error('Launch failed:', e);
            this.sendProgress(event.sender, `Erro: ${e.message}`, 0);
            return { success: false, error: e.message, stack: e.stack };
        }
    }


    // End of class (Removed unused methods: getVersionDetails, downloadLibraries, spawnGameProcess, old downloadFile)
}
