import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');

import fs from 'node:fs';

let mainWindow: BrowserWindow | null = null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// Error checks before doing anything
function validateStartupEnvironment() {
    const preloadPath = path.join(__dirname, 'preload.cjs');
    if (!fs.existsSync(preloadPath)) {
        console.error(`CRITICAL: Preload script not found at ${preloadPath}`);
        // In production, this should probably show a dialog before quitting
        if (app.isReady()) {
            const { dialog } = require('electron');
            dialog.showErrorBox('Startup Error', 'Essential application files (preload script) are missing. Please reinstall the application.');
            app.quit();
        }
        throw new Error('Preload script missing');
    }
}

function createWindow(): void {
    console.log('Creating main window...');

    validateStartupEnvironment();

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
        show: false, // Don't show until ready-to-show
        autoHideMenuBar: true, 
    });

    mainWindow.setMenu(null);

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    console.log('Window created, loading content...');

    if (VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
        const filePath = path.join(__dirname, '../dist/index.html');
        if (!fs.existsSync(filePath)) {
            console.error(`CRITICAL: Index file not found at ${filePath}`);
            return;
        }
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

async function initApp() {
    try {
        console.log('Initializing Application...');
        const { GameHandler } = await import('./handlers/GameHandler.js');
        const gameHandler = new GameHandler();

        // Init handler
        gameHandler.init();
        console.log('GameHandler initialized.');

        createWindow();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        app.quit();
    }
}

app.whenReady().then(() => {
    initApp();
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



