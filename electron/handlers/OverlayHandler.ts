import { BrowserWindow, BrowserView, globalShortcut, screen, ipcMain, app } from 'electron';
import { Logger } from './Logger.js';
import path from 'path';
import fs from 'fs';

// Available hotkeys for user selection
const AVAILABLE_HOTKEYS = ['F6', 'Shift+Tab', 'CommandOrControl+Tab'];

/**
 * Handles the in-game browser overlay functionality.
 * Uses a BrowserView for the website content to prevent layout issues.
 */
export class OverlayHandler {
    private overlayWindow: BrowserWindow | null = null;
    private browserView: BrowserView | null = null;
    private isVisible: boolean = false;
    private isGameRunning: boolean = false;
    private hotkeyRegistered: boolean = false;
    private configPath: string = '';

    private readonly OVERLAY_URL = 'https://craft.blocky.com.br';
    private readonly HEADER_HEIGHT = 48;

    /**
     * Initialize the overlay handler
     * Called after app is ready
     */
    public init(): void {
        Logger.info('OverlayHandler', 'Initializing overlay handler');
        this.configPath = path.join(app.getPath('userData'), 'overlay-config.json');
        this.registerHotkey();
        this.setupIPC();
    }

    /**
     * Setup IPC handlers for overlay navigation
     */
    private setupIPC(): void {
        ipcMain.on('overlay-go-back', () => {
            if (this.browserView && !this.browserView.webContents.isDestroyed()) {
                if (this.browserView.webContents.canGoBack()) {
                    this.browserView.webContents.goBack();
                    Logger.info('OverlayHandler', 'Navigated back');
                }
            }
        });

        ipcMain.on('overlay-go-home', () => {
            if (this.browserView && !this.browserView.webContents.isDestroyed()) {
                this.browserView.webContents.loadURL(this.OVERLAY_URL);
                Logger.info('OverlayHandler', 'Navigated to home');
            }
        });

        ipcMain.on('overlay-close', () => {
            this.hideOverlay();
            Logger.info('OverlayHandler', 'Closed via IPC');
        });

        // Hotkey configuration IPC handlers
        ipcMain.handle('get-overlay-hotkey', () => this.getHotkey());
        ipcMain.handle('set-overlay-hotkey', (_, key: string) => this.setHotkey(key));
        ipcMain.handle('get-available-hotkeys', () => this.getAvailableHotkeys());
    }

    /**
     * Currently registered hotkey
     */
    private registeredHotkey: string | null = null;

    /**
     * Get platform-specific default hotkey
     */
    private getDefaultHotkey(): string {
        // Linux has issues with Shift+Tab in many window managers
        return process.platform === 'linux' ? 'F6' : 'Shift+Tab';
    }

    /**
     * Load saved hotkey from config file
     */
    private loadSavedHotkey(): string {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
                if (config.hotkey && AVAILABLE_HOTKEYS.includes(config.hotkey)) {
                    return config.hotkey;
                }
            }
        } catch (e) {
            Logger.warn('OverlayHandler', 'Failed to load hotkey config, using default');
        }
        return this.getDefaultHotkey();
    }

    /**
     * Save hotkey to config file
     */
    private saveHotkeyConfig(hotkey: string): void {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify({ hotkey }, null, 2));
            Logger.info('OverlayHandler', `Saved hotkey config: ${hotkey}`);
        } catch (e) {
            Logger.error('OverlayHandler', 'Failed to save hotkey config');
        }
    }

    /**
     * Register the configured hotkey
     */
    private registerHotkey(): void {
        const targetKey = this.loadSavedHotkey();
        this.tryRegisterHotkey(targetKey);
    }

    /**
     * Attempt to register a specific hotkey
     */
    private tryRegisterHotkey(key: string): boolean {
        try {
            if (globalShortcut.isRegistered(key)) {
                Logger.warn('OverlayHandler', `Hotkey ${key} is already registered by another application`);
                return false;
            }

            const registered = globalShortcut.register(key, () => {
                Logger.info('OverlayHandler', `${key} pressed`);
                this.toggleOverlay();
            });

            if (registered) {
                this.registeredHotkey = key;
                this.hotkeyRegistered = true;
                Logger.info('OverlayHandler', `Overlay hotkey registered: ${key}`);
                return true;
            } else {
                Logger.warn('OverlayHandler', `Failed to register hotkey: ${key}`);
                return false;
            }
        } catch (e: any) {
            Logger.error('OverlayHandler', `Exception registering ${key}: ${e.message}`);
            return false;
        }
    }

    /**
     * Get currently active hotkey
     */
    public getHotkey(): string {
        return this.registeredHotkey || this.getDefaultHotkey();
    }

    /**
     * Set a new hotkey (unregister old, register new, persist)
     */
    public setHotkey(key: string): { success: boolean; error?: string } {
        // Validate key is in available list
        if (!AVAILABLE_HOTKEYS.includes(key)) {
            return { success: false, error: `Invalid hotkey: ${key}` };
        }

        // Unregister current hotkey
        if (this.registeredHotkey && this.hotkeyRegistered) {
            globalShortcut.unregister(this.registeredHotkey);
            this.hotkeyRegistered = false;
            this.registeredHotkey = null;
        }

        // Register new hotkey
        if (this.tryRegisterHotkey(key)) {
            this.saveHotkeyConfig(key);
            return { success: true };
        } else {
            // Rollback: try to re-register the default
            const fallback = this.getDefaultHotkey();
            if (fallback !== key) {
                this.tryRegisterHotkey(fallback);
            }
            return { success: false, error: `Failed to register hotkey: ${key}. It may be in use by another application.` };
        }
    }

    /**
     * Get list of available hotkeys for UI
     */
    public getAvailableHotkeys(): string[] {
        return [...AVAILABLE_HOTKEYS];
    }

    /**
     * Unregister all shortcuts - call on app quit
     */
    public cleanup(): void {
        if (this.hotkeyRegistered && this.registeredHotkey) {
            globalShortcut.unregister(this.registeredHotkey);
            this.hotkeyRegistered = false;
            this.registeredHotkey = null;
            Logger.info('OverlayHandler', 'Hotkey unregistered');
        }

        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            // Remove view first
            this.overlayWindow.setBrowserView(null);

            if (this.browserView && !this.browserView.webContents.isDestroyed()) {
                // BrowserView doesn't have a destroy method in all versions, 
                // but setting it to null from window detaches it.
                // We rely on garbage collection after detachment.
                (this.browserView.webContents as any).destroy();
            }

            this.overlayWindow.destroy();
            this.overlayWindow = null;
            this.browserView = null;
        }
    }

    /**
     * Create the overlay window containing the header and the BrowserView
     */
    private createOverlayWindow(): void {
        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            Logger.info('OverlayHandler', 'Overlay window already exists');
            return;
        }

        // Get primary display dimensions
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.size;

        // Overlay window size (85% of screen, max 1400x900)
        const windowWidth = Math.min(Math.floor(screenWidth * 0.85), 1400);
        const windowHeight = Math.min(Math.floor(screenHeight * 0.85), 900);

        // Center position
        const x = Math.floor((screenWidth - windowWidth) / 2);
        const y = Math.floor((screenHeight - windowHeight) / 2);

        Logger.info('OverlayHandler', `Creating overlay: ${windowWidth}x${windowHeight} at (${x}, ${y})`);

        // Create the main window (container)
        this.overlayWindow = new BrowserWindow({
            width: windowWidth,
            height: windowHeight,
            x: x,
            y: y,
            frame: false,
            transparent: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            show: false,
            resizable: false,
            movable: false,
            focusable: true,
            hasShadow: true,
            backgroundColor: '#1e1e1e', // Match header background
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                sandbox: false,
            },
        });

        // HTML for the header
        const headerHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; overflow: hidden; background: #1e1e1e; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        #blockycraft-nav-bar {
            height: ${this.HEADER_HEIGHT}px;
            background: #1e1e1e;
            border-bottom: 1px solid #333333;
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 8px;
            color: white;
            user-select: none;
        }
        #blockycraft-nav-bar button {
            background: #2a2a2a;
            border: 1px solid #333333;
            color: #ffffff;
            width: 36px;
            height: 36px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        #blockycraft-nav-bar button:hover {
            background: #333333;
            border-color: #444444;
        }
        #blockycraft-nav-bar button svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }
        #blockycraft-nav-bar .nav-title {
            color: #a1a1aa;
            font-size: 13px;
            margin-left: auto;
            font-weight: 500;
        }
        #blockycraft-nav-bar .close-btn {
            background: transparent;
            border-color: transparent;
            color: #ffffff;
            margin-left: 8px;
        }
        #blockycraft-nav-bar .close-btn:hover {
            background: #ef4444;
            border-color: #ef4444;
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div id="blockycraft-nav-bar">
        <button id="bc-back-btn" title="Voltar" onclick="window.overlayAPI.goBack()">
            <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button id="bc-home-btn" title="Início" onclick="window.overlayAPI.goHome()">
            <svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        <span class="nav-title">BlockyCRAFT Overlay</span>
        <button class="close-btn" id="bc-close-btn" title="Fechar (Shift+Tab)" onclick="window.overlayAPI.close()">
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    </div>
    <script>
        const { ipcRenderer } = require('electron');
        window.overlayAPI = {
            goBack: () => ipcRenderer.send('overlay-go-back'),
            goHome: () => ipcRenderer.send('overlay-go-home'),
            close: () => ipcRenderer.send('overlay-close')
        };
    </script>
</body>
</html>`;

        this.overlayWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(headerHtml)}`);

        // Create the BrowserView for the content
        this.browserView = new BrowserView({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: process.platform !== 'linux',
            }
        });

        this.overlayWindow.setBrowserView(this.browserView);

        // Position the view below the header
        // BrowserView bounds are relative to the window content area
        this.browserView.setBounds({
            x: 0,
            y: this.HEADER_HEIGHT,
            width: windowWidth,
            height: windowHeight - this.HEADER_HEIGHT
        });

        // Disable auto-resize since our window is fixed size
        this.browserView.setAutoResize({ width: true, height: true });

        // Setup browser view events
        this.browserView.webContents.on('did-start-loading', () => {
            Logger.info('OverlayHandler', 'Browser started loading');
        });

        this.browserView.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            Logger.error('OverlayHandler', `Failed to load: ${errorCode} - ${errorDescription}`);
        });

        // Handle new windows in overlay
        this.browserView.webContents.setWindowOpenHandler(({ url }) => {
            Logger.info('OverlayHandler', `Intercepted new window request: ${url}`);
            if (this.browserView && !this.browserView.webContents.isDestroyed()) {
                this.browserView.webContents.loadURL(url);
            }
            return { action: 'deny' };
        });

        // Handle escape key in the browser view too
        this.browserView.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape' && input.type === 'keyDown') {
                this.hideOverlay();
            }
        });

        // Handle escape key in the header (overlay window)
        this.overlayWindow.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape' && input.type === 'keyDown') {
                this.hideOverlay();
            }
        });

        // Load content
        Logger.info('OverlayHandler', `Loading URL: ${this.OVERLAY_URL}`);
        this.browserView.webContents.loadURL(this.OVERLAY_URL);

        // Handle window close
        this.overlayWindow.on('close', (event) => {
            if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
                event.preventDefault();
                this.hideOverlay();
            }
        });

        Logger.info('OverlayHandler', 'Overlay window created with BrowserView');
    }

    /**
     * Toggle overlay visibility
     */
    public toggleOverlay(): void {
        if (!this.isGameRunning) {
            Logger.info('OverlayHandler', 'Game not running - overlay disabled');
            return;
        }

        if (this.isVisible) {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    }

    /**
     * Show the overlay
     */
    private showOverlay(): void {
        // Create windows lazily if needed
        if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
            Logger.info('OverlayHandler', 'Creating overlay window on first use...');
            this.createOverlayWindow();
        }

        if (this.overlayWindow) {
            this.overlayWindow.show();
            this.overlayWindow.focus();
            this.overlayWindow.setAlwaysOnTop(true, 'screen-saver');
            this.isVisible = true;
            Logger.info('OverlayHandler', 'Overlay shown');
        }
    }

    /**
     * Hide the overlay
     */
    private hideOverlay(): void {
        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            this.overlayWindow.hide();
            this.isVisible = false;
            Logger.info('OverlayHandler', 'Overlay hidden');
        }
    }

    /**
     * Set game running state - called by GameHandler
     */
    public setGameRunning(running: boolean): void {
        this.isGameRunning = running;
        Logger.info('OverlayHandler', `Game running state: ${running}`);

        // Hide overlay if game closes while it's open
        if (!running && this.isVisible) {
            this.hideOverlay();
        }
    }

    /**
     * Check if game is currently running
     */
    public isGameActive(): boolean {
        return this.isGameRunning;
    }

    /**
     * Check if overlay is currently visible
     */
    public isOverlayVisible(): boolean {
        return this.isVisible;
    }
}
