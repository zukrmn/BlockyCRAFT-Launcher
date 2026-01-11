import { contextBridge, ipcRenderer } from 'electron';

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('api', {
  launchGame: (options: { username: string }) => ipcRenderer.send('launch-game', options),
  onProgress: (callback: (data: { type: string; current: number; total: number }) => void) => {
    // Strip event object and pass only data
    ipcRenderer.on('download-progress', (_event, data) => callback(data));
  },
  onLog: (callback: (data: string) => void) => {
    ipcRenderer.on('log-message', (_event, data) => callback(data));
  },
  onError: (callback: (err: string) => void) => {
    ipcRenderer.on('launch-error', (_event, err) => callback(err));
  }
});
