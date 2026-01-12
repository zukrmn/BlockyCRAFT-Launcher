import { contextBridge, ipcRenderer } from 'electron';

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // IPC communication methods (for future Minecraft launcher features)
  send: (channel: string, data: unknown) => {
    const validChannels = ['launch-game', 'check-java', 'download-assets'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  receive: (channel: string, callback: (...args: unknown[]) => void) => {
    const validChannels = ['launch-game', 'launch-progress', 'java-status', 'download-progress', 'game-closed', 'game-connected'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  // Invoke methods (request-response pattern)
  invoke: async (channel: string, data: unknown): Promise<unknown> => {
    const validChannels = ['get-minecraft-path', 'get-java-version', 'launch-game', 'check-custom-instance', 'check-update-status', 'perform-update', 'open-external', 'kill-game'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return null;
  },
});

// Also expose the simpler 'api' for the new frontend (friend's branch)
contextBridge.exposeInMainWorld('api', {
  launchGame: (options: { username: string }) => ipcRenderer.send('launch-game', options),
  onProgress: (callback: (data: { type: string; current: number; total: number }) => void) => {
    ipcRenderer.on('download-progress', (_event, data) => callback(data));
  },
  onLog: (callback: (data: string) => void) => {
    ipcRenderer.on('log-message', (_event, data) => callback(data));
  },
  onError: (callback: (err: string) => void) => {
    ipcRenderer.on('launch-error', (_event, err) => callback(err));
  },
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url)
});

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      platform: string;
      send: (channel: string, data: unknown) => void;
      receive: (channel: string, callback: (...args: unknown[]) => void) => void;
      invoke: (channel: string, data: unknown) => Promise<unknown>;
    };
    api: {
      launchGame: (options: { username: string }) => void;
      onProgress: (callback: (data: { type: string; current: number; total: number }) => void) => void;
      onLog: (callback: (data: string) => void) => void;
      onError: (callback: (err: string) => void) => void;
      openExternal: (url: string) => Promise<void>;
    };
  }
}
