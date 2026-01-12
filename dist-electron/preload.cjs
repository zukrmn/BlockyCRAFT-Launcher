// electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Platform info
  platform: process.platform,
  // IPC communication methods (for future Minecraft launcher features)
  send: (channel, data) => {
    const validChannels = ["launch-game", "check-java", "download-assets"];
    if (validChannels.includes(channel)) {
      import_electron.ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, callback) => {
    const validChannels = ["launch-game", "launch-progress", "java-status", "download-progress"];
    if (validChannels.includes(channel)) {
      import_electron.ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
  // Invoke methods (request-response pattern)
  invoke: async (channel, data) => {
    const validChannels = ["get-minecraft-path", "get-java-version", "launch-game", "check-custom-instance", "check-update-status", "perform-update", "open-external"];
    if (validChannels.includes(channel)) {
      return import_electron.ipcRenderer.invoke(channel, data);
    }
    return null;
  }
});
import_electron.contextBridge.exposeInMainWorld("api", {
  launchGame: (options) => import_electron.ipcRenderer.send("launch-game", options),
  onProgress: (callback) => {
    import_electron.ipcRenderer.on("download-progress", (_event, data) => callback(data));
  },
  onLog: (callback) => {
    import_electron.ipcRenderer.on("log-message", (_event, data) => callback(data));
  },
  onError: (callback) => {
    import_electron.ipcRenderer.on("launch-error", (_event, err) => callback(err));
  },
  openExternal: (url) => import_electron.ipcRenderer.invoke("open-external", url)
});
//# sourceMappingURL=preload.cjs.map
