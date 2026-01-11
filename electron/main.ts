import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// Add command line switches before app is ready
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-dev-shm-usage');

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
    setupIPC();
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

function setupIPC() {
    ipcMain.on('launch-game', (event, options) => {
        console.log('[Main] Launch requested for:', options.username);

        const sender = event.sender;
        let progress = 0;

        // Simulating Backend Process (Java Download, Assets, etc.)
        const interval = setInterval(() => {
            progress += 5;

            // Send Progress Object
            const totalSize = 100 * 1024 * 1024; // 100MB
            const currentSize = (progress / 100) * totalSize;

            sender.send('download-progress', {
                type: 'download',
                current: currentSize,
                total: totalSize
            });

            // Send Logs
            if (progress % 20 === 0) {
                const logs = [
                    'Downloading lwjgl.jar...',
                    'Verifying assets index...',
                    'Unpacking natives...',
                    'Checking game hash...'
                ];
                const log = logs[Math.floor(Math.random() * logs.length)];
                sender.send('log-message', `[Backend] ${log}`);
            }

            if (progress >= 100) {
                clearInterval(interval);
                sender.send('log-message', '[Backend] Launching java process...');
                // In real app, we would spawn the child process here
                setTimeout(() => {
                    sender.send('game-launched');
                }, 1000);
            }
        }, 200);
    });
}

