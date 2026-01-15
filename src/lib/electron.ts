export interface ElectronAPI {
    send: (channel: string, data: any) => void;
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    invoke: (channel: string, data: any) => Promise<any>;
    openExternal?: (url: string) => Promise<void>;
    platform?: string;
}

// Safe access to window.electronAPI
const electron = (window as any).electronAPI as ElectronAPI | undefined;

export const ElectronService = {
    isAvailable: !!electron,

    async launchGame(username: string): Promise<{ success: boolean; error?: string }> {
        // Gather settings from localStorage
        const settings = {
            minMemory: localStorage.getItem("settings.minMemory") || "512",
            maxMemory: localStorage.getItem("settings.maxMemory") || "2048",
            javaArgs: localStorage.getItem("settings.javaArgs") || ""
        };

        if (!electron) {
            console.warn('[Mock] Launching game for:', username, 'with settings:', settings);
            return new Promise(resolve => setTimeout(() => resolve({ success: true }), 3000));
        }
        return electron.invoke('launch-game', { username, settings });
    },

    async checkForUpdates(): Promise<{ available: boolean; version?: string; notes?: string }> {
        if (!electron) return { available: false };
        try {
            return await electron.invoke('check-update-status', null);
        } catch (e) {
            console.error('Update check failed:', e);
            return { available: false };
        }
    },

    async performUpdate(): Promise<{ success: boolean; error?: string }> {
        if (!electron) return { success: true };
        return electron.invoke('perform-update', null);
    },

    async openExternal(url: string): Promise<void> {
        if (!electron) {
            console.warn('[Mock] openExternal called with:', url);
            // Fallback for mock environment, e.g., open in new tab if not Electron
            if (typeof window !== 'undefined') {
                window.open(url, '_blank');
            }
            return;
        }
        // Check if openExternal is a direct method on electronAPI (newer bridge)
        if (electron.openExternal) {
            return electron.openExternal(url);
        }
        // Fallback to invoke if openExternal is not a direct method (older bridge)
        return electron.invoke('open-external', url) as Promise<void>;
    },

    async checkCustomInstance(): Promise<boolean> {
        if (!electron) return false;
        return electron.invoke('check-custom-instance', null);
    },

    onProgress(callback: (status: string, progress: number) => void) {
        if (electron) {
            electron.receive('launch-progress', (data: any) => {
                callback(data.status, data.progress);
            });
        } else {
            // Mock progress
            let p = 0;
            const interval = setInterval(() => {
                p += 5;
                callback(`Mocking download... ${p}%`, p);
                if (p >= 100) clearInterval(interval);
            }, 200);
        }
    },

    async killGame(): Promise<{ success: boolean; error?: string }> {
        if (!electron) return { success: true };
        return electron.invoke('kill-game', null);
    },

    onGameClosed(callback: (code: number) => void) {
        if (electron) {
            electron.receive('game-closed', callback);
        }
    },

    onGameConnected(callback: () => void) {
        if (electron) {
            electron.receive('game-connected', callback);
        }
    },

    async getMods(): Promise<Array<{ fileName: string; name: string; description: string; version: string; enabled: boolean; }>> {
        if (!electron) return [];
        return electron.invoke('get-mods', null) as Promise<any[]>;
    },

    async toggleMod(fileName: string, enable: boolean): Promise<{ success: boolean; error?: string }> {
        if (!electron) return { success: false, error: 'Electron not available' };
        return electron.invoke('toggle-mod', { fileName, enable }) as Promise<{ success: boolean; error?: string }>;
    },

    async fetchUrl(url: string): Promise<{ success: boolean; data?: string; error?: string }> {
        if (!electron) return { success: false, error: 'Electron not available' };
        return electron.invoke('fetch-url', url) as Promise<{ success: boolean; data?: string; error?: string }>;
    }
};
