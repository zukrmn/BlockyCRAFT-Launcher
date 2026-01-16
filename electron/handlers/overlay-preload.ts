import { contextBridge, ipcRenderer } from 'electron';

// Expose overlay API to the renderer
contextBridge.exposeInMainWorld('overlayAPI', {
    close: () => ipcRenderer.send('overlay-close'),
    getUrl: () => ipcRenderer.invoke('overlay-get-url'),
});
