import { app, BrowserWindow } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
// These are needed for Docker/Container/Wayland environments
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-dev-shm-usage');

console.log('=== BlockyCRAFT Launcher Starting ===');
console.log('Electron version:', process.versions.electron);
console.log('Node version:', process.versions.node);
console.log('DISPLAY:', process.env['DISPLAY']);
console.log('VITE_DEV_SERVER_URL:', process.env['VITE_DEV_SERVER_URL']);

let mainWindow: BrowserWindow | null = null;

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow(): void {
    console.log('Creating main window...');

    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 800,
        minHeight: 500,
        frame: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
            sandbox: false,
        },
        backgroundColor: '#0f0f0f',
        show: true,
    });

    console.log('Window created, loading content...');

    if (VITE_DEV_SERVER_URL) {
        console.log('Loading from Vite dev server:', VITE_DEV_SERVER_URL);
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        const filePath = path.join(__dirname, '../dist/index.html');
        console.log('Loading from file:', filePath);
        mainWindow.loadFile(filePath);
    }

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Content loaded successfully!');
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorCode, errorDescription);
    });

    mainWindow.on('closed', () => {
        console.log('Window closed');
        mainWindow = null;
    });
}

console.log('Waiting for app ready...');

app.whenReady().then(() => {
    console.log('App is ready!');
    createWindow();
}).catch((err) => {
    console.error('App ready failed:', err);
});

app.on('window-all-closed', () => {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Keep process running
console.log('Main process initialized');
