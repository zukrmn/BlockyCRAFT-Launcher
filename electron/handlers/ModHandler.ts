import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { Logger } from './Logger.js';

export interface Mod {
    fileName: string;
    name: string;
    description: string;
    version: string;
    enabled: boolean;
}

export class ModHandler {
    private userDataPath: string;
    private activeModsDir: string = '';

    constructor() {
        // Use standard Electron userData path resolution
        // This is robust across platforms and matches GameHandler logic
        this.userDataPath = app.getPath('userData');
    }

    public init() {
        ipcMain.handle('get-mods', async () => {
            Logger.info('ModHandler', 'Fetching mods list...');
            return this.getMods();
        });

        ipcMain.handle('toggle-mod', async (event, { fileName, enable }) => {
            Logger.info('ModHandler', `Toggling mod ${fileName} to ${enable}`);
            return this.toggleMod(fileName, enable);
        });
    }

    private async toggleMod(fileName: string, enable: boolean): Promise<{ success: boolean; error?: string }> {
        if (!this.activeModsDir) {
            const msg = 'Cannot toggle mod: No active mods directory found.';
            Logger.error('ModHandler', msg);
            return { success: false, error: msg };
        }

        const disabledDir = path.join(this.activeModsDir, 'disabled');
        // Ensure disabled directory exists
        if (!fs.existsSync(disabledDir)) {
            try {
                await fs.promises.mkdir(disabledDir, { recursive: true });
            } catch (e: any) {
                const msg = `Failed to create disabled directory: ${e.message}`;
                Logger.error('ModHandler', msg);
                return { success: false, error: msg };
            }
        }

        try {
            if (enable) {
                // Enabling: Move from 'disabled' folder to main folder
                const sourcePath = path.join(disabledDir, fileName);
                const destPath = path.join(this.activeModsDir, fileName);

                if (fs.existsSync(sourcePath)) {
                    if (fs.existsSync(destPath)) {
                        const msg = `Destination file already exists: ${destPath}`;
                        Logger.warn('ModHandler', msg);
                        return { success: false, error: msg };
                    }

                    const success = await this.moveFile(sourcePath, destPath);
                    if (success) {
                        Logger.info('ModHandler', `Enabled mod: Moved ${fileName} to active folder`);
                        return { success: true };
                    } else {
                        return { success: false, error: 'Move operation failed (check logs)' };
                    }
                } else {
                    const msg = `Cannot enable: File not found in disabled folder: ${sourcePath}`;
                    Logger.warn('ModHandler', msg);
                    return { success: false, error: msg };
                }
            } else {
                // Disabling: Move from main folder to 'disabled' folder
                const sourcePath = path.join(this.activeModsDir, fileName);
                const destPath = path.join(disabledDir, fileName);

                if (fs.existsSync(sourcePath)) {
                    // Check if destination exists, if so, maybe we should delete it or overwrite?
                    // Safe approach: overwrite if copy+unlink

                    const success = await this.moveFile(sourcePath, destPath);
                    if (success) {
                        Logger.info('ModHandler', `Disabled mod: Moved ${fileName} to disabled folder`);
                        return { success: true };
                    } else {
                        return { success: false, error: 'Move operation failed (check logs)' };
                    }
                } else {
                    const msg = `Cannot disable: File not found in active folder: ${sourcePath}`;
                    Logger.warn('ModHandler', msg);
                    return { success: false, error: msg };
                }
            }
        } catch (e: any) {
            Logger.error('ModHandler', `Failed to toggle mod ${fileName}: ${e.message}`);
            return { success: false, error: e.message };
        }
    }

    /**
     * Robust move helper: Try rename, fallback to copy+unlink
     */
    private async moveFile(src: string, dest: string): Promise<boolean> {
        try {
            await fs.promises.rename(src, dest);
            return true;
        } catch (e) {
            Logger.warn('ModHandler', `Rename failed for ${path.basename(src)}, trying copy+unlink: ${e}`);
            try {
                await fs.promises.copyFile(src, dest);
                await fs.promises.unlink(src);
                return true;
            } catch (e2) {
                Logger.error('ModHandler', `Move failed completely for ${path.basename(src)}: ${e2}`);
                return false;
            }
        }
    }

    private async getMods(): Promise<Mod[]> {
        // Try multiple potential locations for the mods folder
        // 1. instances/default/.minecraft/mods (Standard for custom instances with Prism/Vanilla structure)
        // 2. instances/default/mods (Simplified structure)
        // 3. gamedata/mods (Fallback for vanilla structure used by GameHandler)
        const possiblePaths = [
            path.join(this.userDataPath, 'instances', 'default', '.minecraft', 'mods'),
            path.join(this.userDataPath, 'instances', 'default', 'mods'),
            path.join(this.userDataPath, 'gamedata', 'mods')
        ];

        let modsDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                modsDir = p;
                Logger.info('ModHandler', `Found mods directory at: ${modsDir}`);
                break;
            }
        }

        if (!modsDir) {
            Logger.warn('ModHandler', 'No valid mods directory found in standard locations.');
            return []; // No mods found
        }

        this.activeModsDir = modsDir; // Store for toggling
        const disabledDir = path.join(modsDir, 'disabled');

        const mods: Mod[] = [];

        // Helper to process files in a directory
        const processDirectory = async (dir: string, isEnabled: boolean) => {
            if (!fs.existsSync(dir)) return;

            try {
                const files = await fs.promises.readdir(dir);
                for (const file of files) {
                    if (!file.endsWith('.jar')) continue; // Ignore non-jars in this new strategy (and ignore subdirs like 'disabled')

                    // In main dir, 'disabled' is a folder, so file.endsWith('.jar') filters it out automatically basically (folders don't end in .jar usually)
                    // But good to be safe: check stat? readdir returns names only.
                    // Just catch stat errors or rely on extension.

                    const filePath = path.join(dir, file);
                    // Check if it's a directory
                    const stat = await fs.promises.stat(filePath);
                    if (stat.isDirectory()) continue;

                    let modInfo: Mod = {
                        fileName: file,
                        enabled: isEnabled,
                        name: file, // Default to filename
                        description: '',
                        version: ''
                    };

                    // Attempt to read metadata from fabric.mod.json
                    try {
                        const zip = new AdmZip(filePath);
                        const zipEntries = zip.getEntries();
                        const fabricModJson = zipEntries.find(entry => entry.entryName === 'fabric.mod.json');
                        const legacyModJson = zipEntries.find(entry => entry.entryName === 'mod.json');

                        const metadataEntry = fabricModJson || legacyModJson;

                        if (metadataEntry) {
                            const content = metadataEntry.getData().toString('utf8');
                            const json = JSON.parse(content);

                            if (json.name) modInfo.name = json.name;
                            if (json.description) modInfo.description = json.description;
                            if (json.version) modInfo.version = json.version;
                        }
                    } catch (e) {
                        Logger.warn('ModHandler', `Could not read metadata for ${file}: ${e}`);
                    }

                    mods.push(modInfo);
                }
            } catch (e) {
                Logger.error('ModHandler', `Error scanning directory ${dir}: ${e}`);
            }
        };

        // 1. Scan Enabled Mods (in modsDir)
        await processDirectory(modsDir, true);

        // 2. Scan Disabled Mods (in modsDir/disabled)
        await processDirectory(disabledDir, false);

        // Sort by enabled state then name
        return mods.sort((a, b) => {
            if (a.enabled === b.enabled) {
                return a.name.localeCompare(b.name);
            }
            return a.enabled ? -1 : 1;
        });
    }
}
