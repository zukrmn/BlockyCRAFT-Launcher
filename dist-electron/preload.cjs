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
    const validChannels = ["game-launched", "java-status", "download-progress"];
    if (validChannels.includes(channel)) {
      import_electron.ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
  // Invoke methods (request-response pattern)
  invoke: async (channel, data) => {
    const validChannels = ["get-minecraft-path", "get-java-version"];
    if (validChannels.includes(channel)) {
      return import_electron.ipcRenderer.invoke(channel, data);
    }
    return null;
  }
});
//# sourceMappingURL=preload.cjs.map
