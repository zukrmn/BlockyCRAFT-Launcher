import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');

import { Logger } from './handlers/Logger.js';
import { GameHandler } from './handlers/GameHandler.js';
import { ModHandler } from './handlers/ModHandler.js';

// Initialize logger as early as possible (after imports)
// Note: Full init happens in app.whenReady() when userData is available
const gameHandler = new GameHandler();
gameHandler.init();

const modHandler = new ModHandler();
modHandler.init();

console.log('=== BlockyCRAFT Launcher Starting ===');

console.log('Electron version:', process.versions.electron);

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
        autoHideMenuBar: true, // Hide menu bar
    });

    mainWindow.setMenu(null); // Explicitly remove menu

    // Open external links - use system browser on Windows/macOS, internal window on Linux
    // Open external links - use system browser for all platforms
    ipcMain.handle('open-external', async (event, url) => {
        console.log('Opening external URL:', url);

        try {
            const { shell } = await import('electron');
            await shell.openExternal(url);
        } catch (err) {
            console.error('Failed to open external URL:', err);
        }
    });

    // Proxy fetch requests to bypass CORS
    ipcMain.handle('fetch-url', async (event, url) => {
        Logger.info('Main', `Proxying fetch request to: ${url}`);
        const { net } = await import('electron');
        try {
            const response = await net.fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            const text = await response.text();
            return { success: true, data: text };
        } catch (e: any) {
            Logger.error('Main', `Fetch failed for ${url}: ${e.message}`);
            return { success: false, error: e.message };
        }
    });

    console.log('Window created, loading content...');

    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
        const filePath = path.join(__dirname, '../dist/index.html');
        mainWindow.loadFile(filePath);
    }

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Create Window: did-finish-load');
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Create Window: did-fail-load', errorCode, errorDescription, validatedURL);
    });

    mainWindow.webContents.on('render-process-gone', (event, details) => {
        console.error('Create Window: render-process-gone', details);
    });



    mainWindow.webContents.on('unresponsive', () => {
        console.error('Create Window: unresponsive');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    // Initialize persistent logger
    Logger.init();
    Logger.info('Main', `Electron version: ${process.versions.electron}`);
    Logger.info('Main', `Node version: ${process.versions.node}`);
    Logger.info('Main', `Platform: ${process.platform} ${process.arch}`);

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



