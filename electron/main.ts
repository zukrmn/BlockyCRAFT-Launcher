import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');

import { Logger } from './handlers/Logger.js';
import { GameHandler } from './handlers/GameHandler.js';

// Initialize logger as early as possible (after imports)
// Note: Full init happens in app.whenReady() when userData is available
const gameHandler = new GameHandler();
gameHandler.init();

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
    // (Linux has issues with xdg-open in sandboxed/containerized environments)
    ipcMain.handle('open-external', async (event, url) => {
        console.log('Opening external URL:', url);

        const openInInternalWindow = () => {
            const { nativeTheme } = require('electron');
            nativeTheme.themeSource = 'dark';

            const win = new BrowserWindow({
                width: 1024,
                height: 800,
                title: 'BlockyCRAFT',
                autoHideMenuBar: true,
                backgroundColor: '#1a1a1a',
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            win.setMenu(null);
            win.loadURL(url);
        };

        if (process.platform === 'linux') {
            // Use internal window on Linux to avoid xdg-open issues
            openInInternalWindow();
        } else {
            // Use system browser on Windows and macOS
            const { shell } = await import('electron');
            shell.openExternal(url);
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



