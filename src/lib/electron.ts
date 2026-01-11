export interface ElectronAPI {
    send: (channel: string, data: any) => void;
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    invoke: (channel: string, data: any) => Promise<any>;
    platform?: string;
}

// Safe access to window.electronAPI
const electron = (window as any).electronAPI as ElectronAPI | undefined;

export const ElectronService = {
    isAvailable: !!electron,

    async launchGame(username: string): Promise<{ success: boolean; error?: string }> {
        if (!electron) {
            console.warn('[Mock] Launching game for:', username);
            return new Promise(resolve => setTimeout(() => resolve({ success: true }), 3000));
        }
        return electron.invoke('launch-game', { username });
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
    }
};
