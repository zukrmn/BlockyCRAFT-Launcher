var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron = require("electron");
var import_node_path = __toESM(require("node:path"), 1);
import_electron.app.commandLine.appendSwitch("no-sandbox");
import_electron.app.commandLine.appendSwitch("disable-gpu");
import_electron.app.commandLine.appendSwitch("disable-software-rasterizer");
import_electron.app.commandLine.appendSwitch("disable-dev-shm-usage");
console.log("=== BlockyCRAFT Launcher Starting ===");
console.log("Electron version:", process.versions.electron);
var mainWindow = null;
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  console.log("Creating main window...");
  mainWindow = new import_electron.BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    frame: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: import_node_path.default.join(__dirname, "preload.cjs"),
      sandbox: false
    },
    backgroundColor: "#0f0f0f",
    show: true
  });
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const filePath = import_node_path.default.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(filePath);
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
import_electron.app.whenReady().then(() => {
  createWindow();
  setupIPC();
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (import_electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
function setupIPC() {
  import_electron.ipcMain.on("launch-game", (event, options) => {
    console.log("[Main] Launch requested for:", options.username);
    const sender = event.sender;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      const totalSize = 100 * 1024 * 1024;
      const currentSize = progress / 100 * totalSize;
      sender.send("download-progress", {
        type: "download",
        current: currentSize,
        total: totalSize
      });
      if (progress % 20 === 0) {
        const logs = [
          "Downloading lwjgl.jar...",
          "Verifying assets index...",
          "Unpacking natives...",
          "Checking game hash..."
        ];
        const log = logs[Math.floor(Math.random() * logs.length)];
        sender.send("log-message", `[Backend] ${log}`);
      }
      if (progress >= 100) {
        clearInterval(interval);
        sender.send("log-message", "[Backend] Launching java process...");
        setTimeout(() => {
          sender.send("game-launched");
        }, 1e3);
      }
    }, 200);
  });
}
//# sourceMappingURL=main.cjs.map
