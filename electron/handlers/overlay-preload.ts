import { contextBridge, ipcRenderer } from 'electron';

// Expose overlay API to the renderer
contextBridge.exposeInMainWorld('overlayAPI', {
    close: () => ipcRenderer.send('overlay-close'),
    goBack: () => ipcRenderer.send('overlay-go-back'),
    goHome: () => ipcRenderer.send('overlay-go-home'),
    getUrl: () => ipcRenderer.invoke('overlay-get-url'),
});
