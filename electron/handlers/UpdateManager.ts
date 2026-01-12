import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { createWriteStream } from 'fs';
import AdmZip from 'adm-zip';

// VPS Configuration - Primary and Fallback URLs for version.json
const VERSION_JSON_URLS = [
    'https://craft.blocky.com.br/launcher-assets/version.json',
    'https://marina.rodrigorocha.art.br/launcher-assets/version.json'
];

// Type for URL that can be a single string or array of strings
type UrlOrUrls = string | string[];

interface RemoteVersionInfo {
    launcher_version: string;
    instance: {
        version: string;
        url: UrlOrUrls;  // Can be string or string[] for fallback URLs
    };
    libraries: {
        version: string;
        url: UrlOrUrls;  // Can be string or string[] for fallback URLs
    };
    mods?: {
        version: string;
        url: UrlOrUrls;  // Can be string or string[] for fallback URLs
        notes?: string;
    };
}

interface LocalVersionInfo {
    instance: string;
    libraries: string;
    mods: string;
}

interface UpdateCheckResult {
    instanceUpdate: boolean;
    librariesUpdate: boolean;
    modsUpdate: boolean;
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
            mods: '0.0.0'
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
    public async checkForUpdates(): Promise<UpdateCheckResult> {
        const localVersions = this.getLocalVersions();
        const remoteVersions = await this.fetchRemoteVersions();

        if (!remoteVersions) {
            return {
                instanceUpdate: false,
                librariesUpdate: false,
                modsUpdate: false,
                remoteVersions: null,
                error: 'Failed to fetch remote version info'
            };
        }

        const instanceUpdate = remoteVersions.instance.version !== localVersions.instance;
        const librariesUpdate = remoteVersions.libraries.version !== localVersions.libraries;
        const modsUpdate = remoteVersions.mods ?
            remoteVersions.mods.version !== localVersions.mods : false;

        console.log('[UpdateManager] Update check result:', {
            instanceUpdate,
            librariesUpdate,
            modsUpdate,
            local: localVersions,
            remote: {
                instance: remoteVersions.instance.version,
                libraries: remoteVersions.libraries.version,
                mods: remoteVersions.mods?.version
            }
        });

        return {
            instanceUpdate,
            librariesUpdate,
            modsUpdate,
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
        const filename = path.basename(destPath);
        progressCallback?.(`Baixando ${filename}...`, 0);

        // Normalize to array of URLs
        const urls = this.normalizeUrls(urlOrUrls);

        let lastError: Error | null = null;

        for (let i = 0; i < urls.length; i++) {
            const tryUrl = urls[i];
            try {
                console.log(`[UpdateManager] Downloading from URL ${i + 1}/${urls.length}: ${tryUrl}`);

                const response = await fetch(tryUrl, {
                    signal: AbortSignal.timeout(60000) // 60 second timeout for downloads
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const total = Number(response.headers.get('content-length')) || 0;

                // Ensure directory exists
                fs.mkdirSync(path.dirname(destPath), { recursive: true });

                const fileStream = createWriteStream(destPath);

                if (!response.body) {
                    throw new Error('No response body');
                }

                const reader = response.body.getReader();
                let downloaded = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    fileStream.write(Buffer.from(value));
                    downloaded += value.length;

                    if (total > 0) {
                        const percent = Math.round((downloaded / total) * 100);
                        progressCallback?.(`Baixando ${filename}...`, percent);
                    }
                }

                fileStream.end();

                // Wait for file to finish writing
                await new Promise<void>((resolve, reject) => {
                    fileStream.on('finish', resolve);
                    fileStream.on('error', reject);
                });

                console.log(`[UpdateManager] Downloaded ${filename} (${this.formatSize(downloaded)}) from ${tryUrl}`);
                return; // Success, exit function

            } catch (e: any) {
                console.warn(`[UpdateManager] Failed to download from ${tryUrl}:`, e.message);
                lastError = e;
                // Continue to next URL
            }
        }

        // All URLs failed
        throw lastError || new Error(`Failed to download ${filename} from all ${urls.length} sources`);
    }

    /**
     * Extracts a zip file to a directory
     */
    private extractZip(zipPath: string, destDir: string): void {
        console.log(`[UpdateManager] Extracting ${zipPath} to ${destDir}`);

        fs.mkdirSync(destDir, { recursive: true });
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(destDir, true);

        console.log(`[UpdateManager] Extraction complete`);
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

            // Clear old instance (keep some user data)
            progressCallback?.('Preparando atualização da instância...', 0);

            // Remove old instance.cfg marker if exists
            const oldMarker = path.join(this.instanceDir, 'instance.cfg');
            if (fs.existsSync(oldMarker)) {
                // Backup user options if they exist
                const optionsPath = path.join(this.instanceDir, '.minecraft', 'options.txt');
                const optionsBackup = path.join(this.dataPath, 'options_backup.txt');
                if (fs.existsSync(optionsPath)) {
                    fs.copyFileSync(optionsPath, optionsBackup);
                }
            }

            // Extract
            progressCallback?.('Extraindo instância...', 50);
            this.extractZip(tempZip, this.instanceDir);

            // Restore options if backed up
            const optionsBackup = path.join(this.dataPath, 'options_backup.txt');
            const optionsPath = path.join(this.instanceDir, '.minecraft', 'options.txt');
            if (fs.existsSync(optionsBackup)) {
                fs.copyFileSync(optionsBackup, optionsPath);
                fs.unlinkSync(optionsBackup);
            }

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
     */
    public async updateLibraries(
        remoteVersions: RemoteVersionInfo,
        progressCallback?: (status: string, percent: number) => void
    ): Promise<void> {
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
                updateCheck.modsUpdate
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
