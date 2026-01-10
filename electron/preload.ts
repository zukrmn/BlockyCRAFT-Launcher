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
    const validChannels = ['game-launched', 'java-status', 'download-progress'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
  
  // Invoke methods (request-response pattern)
  invoke: async (channel: string, data: unknown): Promise<unknown> => {
    const validChannels = ['get-minecraft-path', 'get-java-version'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return null;
  },
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
  }
}
