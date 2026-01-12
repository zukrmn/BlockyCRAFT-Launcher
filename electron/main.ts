import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');

import { GameHandler } from './handlers/GameHandler.js';
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



