export interface ElectronAPI {
    send: (channel: string, data: any) => void;
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    invoke: (channel: string, data: any) => Promise<any>;
    platform?: string;
}
export declare const ElectronService: {
    isAvailable: boolean;
    launchGame(username: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    checkForUpdates(): Promise<{
        available: boolean;
        version?: string;
        notes?: string;
    }>;
    performUpdate(): Promise<{
        success: boolean;
        error?: string;
    }>;
    checkCustomInstance(): Promise<boolean>;
    onProgress(callback: (status: string, progress: number) => void): void;
};
