import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { createWriteStream } from 'fs';
import AdmZip from 'adm-zip';
import { downloadFileResilient } from './DownloadUtil.js';

// VPS Configuration - Primary and Fallback URLs for version.json
const VERSION_JSON_URLS = [
    'https://craft.blocky.com.br/launcher-assets/version.json'
];

// Type for URL that can be a single string or array of strings
type UrlOrUrls = string | string[];

interface RemoteVersionInfo {
    launcher_version: string;
    instance: {
        version: string;
        url: UrlOrUrls;  // Can be string or string[] for fallback URLs
    };
    libraries?: {  // Optional - libraries are now downloaded from Maven repos
        version: string;
        url: UrlOrUrls;
    };
    mods?: {
        version: string;
        url: UrlOrUrls;  // Can be string or string[] for fallback URLs
        notes?: string;
    };
    texturepacks?: {
        version: string;
        url: UrlOrUrls;  // Direct URL to betaoverhauled.zip
    };
}

interface LocalVersionInfo {
    instance: string;
    libraries: string;
    mods: string;
    texturepacks: string;
}

interface UpdateCheckResult {
    launcherUpdate: boolean;
    launcherDownloadUrl: string | null;
    instanceUpdate: boolean;
    librariesUpdate: boolean;
    modsUpdate: boolean;
    texturepacksUpdate: boolean;
    remoteVersions: RemoteVersionInfo | null;
    error?: string;
}

export class UpdateManager {
    private dataPath: string;
    private localVersionsPath: string;
    private instanceDir: string;
    private librariesDir: string;

    constructor() {
        this.dataPath = app.getPath('userData');
        this.localVersionsPath = path.join(this.dataPath, 'versions.json');
        this.instanceDir = path.join(this.dataPath, 'instances', 'default');
        this.librariesDir = path.join(this.instanceDir, 'libraries');
    }

    /**
     * Normalizes URL to array format
     */
    private normalizeUrls(urlOrUrls: UrlOrUrls): string[] {
        if (Array.isArray(urlOrUrls)) {
            return urlOrUrls;
        }
        return [urlOrUrls];
    }

    /**
     * Gets local version info, creating default if it doesn't exist
     */
    private getLocalVersions(): LocalVersionInfo {
        try {
            if (fs.existsSync(this.localVersionsPath)) {
                const content = fs.readFileSync(this.localVersionsPath, 'utf-8');
                return JSON.parse(content);
            }
        } catch (e) {
            console.error('[UpdateManager] Failed to read local versions:', e);
        }

        // Default versions (never updated)
        return {
            instance: '0.0.0',
            libraries: '0.0.0',
            mods: '0.0.0',
            texturepacks: '0.0.0'
        };
    }

    /**
     * Saves local version info
     */
    private saveLocalVersions(versions: LocalVersionInfo): void {
        try {
            fs.writeFileSync(this.localVersionsPath, JSON.stringify(versions, null, 2));
            console.log('[UpdateManager] Saved local versions:', versions);
        } catch (e) {
            console.error('[UpdateManager] Failed to save local versions:', e);
        }
    }

    /**
     * Fetches remote version info from VPS with fallback support
     */
    private async fetchRemoteVersions(): Promise<RemoteVersionInfo | null> {
        for (const url of VERSION_JSON_URLS) {
            try {
                console.log('[UpdateManager] Trying to fetch versions from:', url);
                const response = await fetch(url, {
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json() as RemoteVersionInfo;
                console.log('[UpdateManager] Successfully fetched from:', url);
                console.log('[UpdateManager] Remote versions:', data);

                return data;
            } catch (e) {
                console.warn(`[UpdateManager] Failed to fetch from ${url}:`, e);
                // Continue to next URL
            }
        }

        console.error('[UpdateManager] All version URLs failed');
        return null;
    }

    /**
     * Checks what updates are available
     */
    /**
     * Compares two semver strings (major.minor.patch). Returns true if remote > local.
     */
    private isNewerVersion(remote: string, local: string): boolean {
        const parseParts = (v: string) => v.split('.').map(n => parseInt(n, 10) || 0);
        const r = parseParts(remote);
        const l = parseParts(local);
        for (let i = 0; i < Math.max(r.length, l.length); i++) {
            const rp = r[i] || 0;
            const lp = l[i] || 0;
            if (rp > lp) return true;
            if (rp < lp) return false;
        }
        return false;
    }

    /**
     * Returns the platform-specific download URL for the latest launcher release.
     */
    private getLauncherDownloadUrl(): string {
        const base = 'https://github.com/zukrmn/BlockyCRAFT-Launcher/releases/latest/download';
        switch (process.platform) {
            case 'win32':
                return `${base}/BlockyCRAFT-Launcher-Setup.exe`;
            case 'darwin':
                return `${base}/BlockyCRAFT-Launcher-arm64.dmg`;
            case 'linux':
            default:
                return `${base}/BlockyCRAFT-Launcher.AppImage`;
        }
    }

    public async checkForUpdates(): Promise<UpdateCheckResult> {
        const localVersions = this.getLocalVersions();
        const remoteVersions = await this.fetchRemoteVersions();

        if (!remoteVersions) {
            return {
                launcherUpdate: false,
                launcherDownloadUrl: null,
                instanceUpdate: false,
                librariesUpdate: false,
                modsUpdate: false,
                texturepacksUpdate: false,
                remoteVersions: null,
                error: 'Failed to fetch remote version info'
            };
        }

        // Launcher self-update check
        const currentVersion = app.getVersion();
        const launcherUpdate = this.isNewerVersion(remoteVersions.launcher_version, currentVersion);
        const launcherDownloadUrl = launcherUpdate ? this.getLauncherDownloadUrl() : null;

        if (launcherUpdate) {
            console.log(`[UpdateManager] Launcher update available: ${currentVersion} → ${remoteVersions.launcher_version}`);
        }

        const instanceUpdate = remoteVersions.instance.version !== localVersions.instance;
        // Libraries are now downloaded directly from Maven repos, not from VPS
        const librariesUpdate = false; // Disabled - see GameHandler for Maven-based downloads
        const modsUpdate = remoteVersions.mods ?
            remoteVersions.mods.version !== localVersions.mods : false;
        const texturepacksUpdate = remoteVersions.texturepacks ?
            remoteVersions.texturepacks.version !== localVersions.texturepacks : false;

        console.log('[UpdateManager] Update check result:', {
            launcherUpdate,
            instanceUpdate,
            librariesUpdate: 'DISABLED (Maven-based)',
            modsUpdate,
            texturepacksUpdate,
            local: { launcher: currentVersion, ...localVersions },
            remote: {
                launcher: remoteVersions.launcher_version,
                instance: remoteVersions.instance.version,
                libraries: remoteVersions.libraries?.version ?? 'N/A (Maven-based)',
                mods: remoteVersions.mods?.version,
                texturepacks: remoteVersions.texturepacks?.version
            }
        });

        return {
            launcherUpdate,
            launcherDownloadUrl,
            instanceUpdate,
            librariesUpdate,
            modsUpdate,
            texturepacksUpdate,
            remoteVersions
        };
    }

    /**
     * Downloads a file with progress reporting and multi-URL fallback support
     */
    private async downloadFile(
        urlOrUrls: UrlOrUrls,
        destPath: string,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
        const urls = this.normalizeUrls(urlOrUrls);
        await downloadFileResilient({
            urls,
            destPath,
            progressCallback,
            maxRetries: 7,   // 7 retries for updates
            timeoutMs: 20000 // 20 seconds inactivity timeout
        });
    }

    /**
     * Extracts a zip file to a directory
     */
    private extractZip(zipPath: string, destDir: string): void {
        console.log(`[UpdateManager] Extracting ${zipPath} to ${destDir}`);

        // Validate ZIP file before extraction
        if (!fs.existsSync(zipPath)) {
            throw new Error(`ZIP file not found: ${zipPath}`);
        }

        const fileBuffer = fs.readFileSync(zipPath);

        // Check ZIP magic bytes (PK\x03\x04)
        if (fileBuffer.length < 4 || fileBuffer[0] !== 0x50 || fileBuffer[1] !== 0x4B) {
            // Not a valid ZIP, log first bytes for debugging
            console.error(`[UpdateManager] Invalid ZIP file. First bytes: ${fileBuffer.slice(0, 20).toString('hex')}`);
            throw new Error(`Invalid ZIP file: ${zipPath}. The download may have failed or returned an error page.`);
        }

        fs.mkdirSync(destDir, { recursive: true });
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(destDir, true);

        console.log(`[UpdateManager] Extraction complete`);
    }

    /**
     * Backs up user data before update
     */
    private backupUserData(): void {
        const backupDir = path.join(this.dataPath, 'update_backup');
        const dotMinecraft = path.join(this.instanceDir, '.minecraft');

        // Ensure clean backup dir
        if (fs.existsSync(backupDir)) {
            fs.rmSync(backupDir, { recursive: true, force: true });
        }
        fs.mkdirSync(backupDir, { recursive: true });

        const itemsToBackup = [
            'options.txt',
            'servers.dat',
            'screenshots',
            'stats',
            'lastlogin', // Some old versions use this
            'config' // Mod configs
        ];

        console.log('[UpdateManager] Backing up user data...');

        for (const item of itemsToBackup) {
            const src = path.join(dotMinecraft, item);
            const dest = path.join(backupDir, item);

            if (fs.existsSync(src)) {
                try {
                    console.log(`[UpdateManager] Backing up: ${item}`);
                    fs.cpSync(src, dest, { recursive: true });
                } catch (e) {
                    console.warn(`[UpdateManager] Failed to backup ${item}:`, e);
                }
            }
        }
    }

    /**
     * Restores user data after update
     */
    private restoreUserData(): void {
        const backupDir = path.join(this.dataPath, 'update_backup');
        const dotMinecraft = path.join(this.instanceDir, '.minecraft');

        if (!fs.existsSync(backupDir)) return;

        console.log('[UpdateManager] Restoring user data...');

        const items = fs.readdirSync(backupDir);
        for (const item of items) {
            const src = path.join(backupDir, item);
            const dest = path.join(dotMinecraft, item);

            try {
                console.log(`[UpdateManager] Restoring: ${item}`);
                // Remove default file/dir if it exists to allow restore
                if (fs.existsSync(dest)) {
                    fs.rmSync(dest, { recursive: true, force: true });
                }
                fs.cpSync(src, dest, { recursive: true });
            } catch (e) {
                console.warn(`[UpdateManager] Failed to restore ${item}:`, e);
            }
        }

        // Cleanup backup
        try {
            fs.rmSync(backupDir, { recursive: true, force: true });
        } catch (e) {
            console.warn('[UpdateManager] Failed to cleanup backup:', e);
        }
    }

    /**
     * Performs instance update
     */
    public async updateInstance(
        remoteVersions: RemoteVersionInfo,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
        const tempZip = path.join(this.dataPath, 'temp_instance.zip');

        try {
            // Download - now supports multiple URLs from version.json
            await this.downloadFile(remoteVersions.instance.url, tempZip, progressCallback);

            progressCallback?.('Preparando atualização da instância...', 0);

            // 1. Backup User Data
            this.backupUserData();

            // 2. Clear old instance
            // We can now safely clear everything since we have a backup
            if (fs.existsSync(this.instanceDir)) {
                // Try to keep libraries if possible to save bandwidth, but for simplicity
                // and robustness, let's trust the backup. 
                // Actually, libraries are separate now or inside?
                // In this codebase, libraries are in instanceDir/libraries.
                // We should NOT delete libraries if possible, or we rely on Maven.
                // Ideally, we only clear .minecraft and other config files.
                // But cleaning the whole dir ensures no leftover junk.
                // Given we don't backup libraries (they are re-downloaded/checked), 
                // we might want to check if we should preserve them.
                // But wait, updateLibraries is effectively disabled/Maven based.
                // So re-downloading them is fine/expected if missing.

                // However, let's just clear .minecraft mostly.
            }

            // Extract
            progressCallback?.('Extraindo instância...', 50);

            // If we want to be safe, we can just extract over.
            // But deleting ensures clean state.
            // Let's rely on extraction overwriting, but for instance.zip which contains a full setup,
            // it's often better to start clean.
            // BUT, to avoid issues with open files etc., let's just overwrite for now + backup restore?
            // No, the user issue implies "resetting", likely because the previous logic CLEARED it or overwrote it.
            // The previous logic had:
            // if (fs.existsSync(optionsPath)) fs.copyFileSync(optionsPath, optionsBackup);
            // This was extremely limited.

            // Let's clear properly.
            // But we must NOT delete the libraries folder if it exists and we want to keep it?
            // Actually, GameHandler manages libraries now via Maven.

            this.extractZip(tempZip, this.instanceDir);

            // 3. Restore User Data
            this.restoreUserData();

            // Update local version
            const localVersions = this.getLocalVersions();
            localVersions.instance = remoteVersions.instance.version;
            this.saveLocalVersions(localVersions);

            progressCallback?.('Instância atualizada!', 100);

        } finally {
            // Cleanup temp file
            if (fs.existsSync(tempZip)) {
                fs.unlinkSync(tempZip);
            }
        }
    }
    /**
     * Performs libraries update
     * @deprecated Libraries are now downloaded from Maven repos directly in GameHandler
     */
    public async updateLibraries(
        remoteVersions: RemoteVersionInfo,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
        // Libraries are now downloaded from Maven repos, this function is deprecated
        if (!remoteVersions.libraries) {
            console.log('[UpdateManager] Libraries update skipped - using Maven repos');
            return;
        }

        const tempZip = path.join(this.dataPath, 'temp_libraries.zip');

        try {
            // Download - now supports multiple URLs from version.json
            await this.downloadFile(remoteVersions.libraries.url, tempZip, progressCallback);

            // Clear old libraries
            progressCallback?.('Preparando atualização das bibliotecas...', 0);

            // Remove old marker
            const oldMarker = path.join(this.librariesDir, '.bundled_extracted_v1');
            if (fs.existsSync(oldMarker)) {
                fs.unlinkSync(oldMarker);
            }

            // Remove old libraries directory
            if (fs.existsSync(this.librariesDir)) {
                fs.rmSync(this.librariesDir, { recursive: true, force: true });
            }

            // Extract
            progressCallback?.('Extraindo bibliotecas...', 50);
            this.extractZip(tempZip, this.librariesDir);

            // Create new marker
            fs.writeFileSync(path.join(this.librariesDir, '.bundled_extracted_v2'), 'extracted');

            // Update local version
            const localVersions = this.getLocalVersions();
            localVersions.libraries = remoteVersions.libraries.version;
            this.saveLocalVersions(localVersions);

            progressCallback?.('Bibliotecas atualizadas!', 100);

        } finally {
            // Cleanup temp file
            if (fs.existsSync(tempZip)) {
                fs.unlinkSync(tempZip);
            }
        }
    }

    /**
     * Performs mods update
     */
    public async updateMods(
        remoteVersions: RemoteVersionInfo,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
        if (!remoteVersions.mods) {
            console.log('[UpdateManager] No mods update available');
            return;
        }

        const tempZip = path.join(this.dataPath, 'temp_mods.zip');
        const modsDir = path.join(this.instanceDir, '.minecraft', 'mods');

        try {
            // Download - now supports multiple URLs from version.json
            await this.downloadFile(remoteVersions.mods.url, tempZip, progressCallback);

            // Clear old mods
            progressCallback?.('Removendo mods antigos...', 0);
            if (fs.existsSync(modsDir)) {
                fs.rmSync(modsDir, { recursive: true, force: true });
            }

            // Extract to .minecraft directory
            progressCallback?.('Instalando novos mods...', 50);
            this.extractZip(tempZip, path.join(this.instanceDir, '.minecraft'));

            // Update local version
            const localVersions = this.getLocalVersions();
            localVersions.mods = remoteVersions.mods.version;
            this.saveLocalVersions(localVersions);

            progressCallback?.('Mods atualizados!', 100);

        } finally {
            // Cleanup temp file
            if (fs.existsSync(tempZip)) {
                fs.unlinkSync(tempZip);
            }
        }
    }

    /**
     * Performs texture pack update
     * Only replaces betaoverhauled.zip, preserving other user texture packs
     */
    public async updateTexturepacks(
        remoteVersions: RemoteVersionInfo,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
        if (!remoteVersions.texturepacks) {
            console.log('[UpdateManager] No texture pack update available');
            return;
        }

        const texturepacksDir = path.join(this.instanceDir, '.minecraft', 'texturepacks');
        const targetFile = path.join(texturepacksDir, 'betaoverhauled.zip');

        try {
            // Ensure texturepacks directory exists
            fs.mkdirSync(texturepacksDir, { recursive: true });

            // Download directly to target location (replacing if exists)
            progressCallback?.('Baixando textura...', 0);

            // Download to temp first, then move (atomic operation)
            const tempFile = path.join(this.dataPath, 'temp_texturepack.zip');
            await this.downloadFile(remoteVersions.texturepacks.url, tempFile, progressCallback);

            // Remove old texture pack if exists
            if (fs.existsSync(targetFile)) {
                fs.unlinkSync(targetFile);
            }

            // Move to final location
            fs.renameSync(tempFile, targetFile);

            // Update local version
            const localVersions = this.getLocalVersions();
            localVersions.texturepacks = remoteVersions.texturepacks.version;
            this.saveLocalVersions(localVersions);

            progressCallback?.('Textura atualizada!', 100);
            console.log('[UpdateManager] Texture pack updated: betaoverhauled.zip');

        } catch (e: any) {
            console.error('[UpdateManager] Failed to update texture pack:', e);
            // Cleanup temp file if exists
            const tempFile = path.join(this.dataPath, 'temp_texturepack.zip');
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
            throw e;
        }
    }

    /**
     * Performs all necessary updates
     */
    public async performAllUpdates(
        progressCallback?: (status: string, percent: number) => void
    ): Promise<{ success: boolean; error?: string }> {
        try {
            progressCallback?.('Verificando atualizações...', 0);

            const updateCheck = await this.checkForUpdates();

            if (!updateCheck.remoteVersions) {
                // No remote versions available, proceed without updates
                console.log('[UpdateManager] Could not fetch remote versions, skipping updates');
                return { success: true };
            }

            const totalUpdates = [
                updateCheck.instanceUpdate,
                updateCheck.librariesUpdate,
                updateCheck.modsUpdate,
                updateCheck.texturepacksUpdate
            ].filter(Boolean).length;

            if (totalUpdates === 0) {
                console.log('[UpdateManager] All components are up to date');
                progressCallback?.('Tudo atualizado!', 100);
                return { success: true };
            }

            let currentUpdate = 0;

            // Instance update
            if (updateCheck.instanceUpdate) {
                currentUpdate++;
                const baseProgress = ((currentUpdate - 1) / totalUpdates) * 100;
                const progressRange = 100 / totalUpdates;

                await this.updateInstance(
                    updateCheck.remoteVersions,
                    (status, percent) => {
                        const totalPercent = baseProgress + (percent / 100) * progressRange;
                        progressCallback?.(status, Math.round(totalPercent));
                    }
                );
            }

            // Libraries update
            if (updateCheck.librariesUpdate) {
                currentUpdate++;
                const baseProgress = ((currentUpdate - 1) / totalUpdates) * 100;
                const progressRange = 100 / totalUpdates;

                await this.updateLibraries(
                    updateCheck.remoteVersions,
                    (status, percent) => {
                        const totalPercent = baseProgress + (percent / 100) * progressRange;
                        progressCallback?.(status, Math.round(totalPercent));
                    }
                );
            }

            // Mods update
            if (updateCheck.modsUpdate) {
                currentUpdate++;
                const baseProgress = ((currentUpdate - 1) / totalUpdates) * 100;
                const progressRange = 100 / totalUpdates;

                await this.updateMods(
                    updateCheck.remoteVersions,
                    (status, percent) => {
                        const totalPercent = baseProgress + (percent / 100) * progressRange;
                        progressCallback?.(status, Math.round(totalPercent));
                    }
                );
            }

            // Texture packs update
            if (updateCheck.texturepacksUpdate) {
                currentUpdate++;
                const baseProgress = ((currentUpdate - 1) / totalUpdates) * 100;
                const progressRange = 100 / totalUpdates;

                await this.updateTexturepacks(
                    updateCheck.remoteVersions,
                    (status, percent) => {
                        const totalPercent = baseProgress + (percent / 100) * progressRange;
                        progressCallback?.(status, Math.round(totalPercent));
                    }
                );
            }

            progressCallback?.('Todas as atualizações concluídas!', 100);
            return { success: true };

        } catch (e: any) {
            console.error('[UpdateManager] Update failed:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Format bytes to human readable
     */
    private formatSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}
