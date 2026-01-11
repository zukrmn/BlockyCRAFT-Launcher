// electron/preload.ts
var import_electron = require("electron");
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
  }
});
//# sourceMappingURL=preload.cjs.map
