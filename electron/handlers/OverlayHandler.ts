import { BrowserWindow, globalShortcut, screen, ipcMain } from 'electron';
import { Logger } from './Logger.js';

/**
 * Handles the in-game browser overlay functionality.
 * Centered browser window with navigation controls.
 */
export class OverlayHandler {
    private overlayWindow: BrowserWindow | null = null;
    private backdropWindow: BrowserWindow | null = null;
    private isVisible: boolean = false;
    private isGameRunning: boolean = false;
    private hotkeyRegistered: boolean = false;

    private readonly OVERLAY_URL = 'https://craft.blocky.com.br';

    /**
     * Initialize the overlay handler
     * Called after app is ready
     */
    public init(): void {
        Logger.info('OverlayHandler', 'Initializing overlay handler');
        this.registerHotkey();
        this.setupIPC();
    }

    /**
     * Setup IPC handlers for overlay navigation
     */
    private setupIPC(): void {
        ipcMain.on('overlay-go-back', () => {
            if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
                if (this.overlayWindow.webContents.canGoBack()) {
                    this.overlayWindow.webContents.goBack();
                    Logger.info('OverlayHandler', 'Navigated back');
                }
            }
        });

        ipcMain.on('overlay-go-home', () => {
            if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
                this.overlayWindow.webContents.loadURL(this.OVERLAY_URL);
                Logger.info('OverlayHandler', 'Navigated to home');
            }
        });

        ipcMain.on('overlay-close', () => {
            this.hideOverlay();
            Logger.info('OverlayHandler', 'Closed via IPC');
        });
    }

    /**
     * Register the Shift+Tab global hotkey
     */
    private registerHotkey(): void {
        try {
            const registered = globalShortcut.register('Shift+Tab', () => {
                Logger.info('OverlayHandler', 'Shift+Tab pressed');
                this.toggleOverlay();
            });

            if (registered) {
                this.hotkeyRegistered = true;
                Logger.info('OverlayHandler', 'Shift+Tab hotkey registered successfully');
            } else {
                Logger.error('OverlayHandler', 'Failed to register Shift+Tab hotkey');
            }
        } catch (e: any) {
            Logger.error('OverlayHandler', `Failed to register hotkey: ${e.message}`);
        }
    }

    /**
     * Unregister all shortcuts - call on app quit
     */
    public cleanup(): void {
        if (this.hotkeyRegistered) {
            globalShortcut.unregister('Shift+Tab');
            this.hotkeyRegistered = false;
            Logger.info('OverlayHandler', 'Hotkey unregistered');
        }

        if (this.backdropWindow && !this.backdropWindow.isDestroyed()) {
            this.backdropWindow.destroy();
            this.backdropWindow = null;
        }

        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            this.overlayWindow.destroy();
            this.overlayWindow = null;
        }
    }

    /**
     * Create the backdrop window (10% transparent fullscreen)
     */
    private createBackdropWindow(): void {
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.size;

        this.backdropWindow = new BrowserWindow({
            width: width,
            height: height,
            x: 0,
            y: 0,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            show: false,
            resizable: false,
            movable: false,
            focusable: false,
            hasShadow: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        // Load backdrop with 10% opacity
        const backdropHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; }
        html, body {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body></body>
</html>`;

        this.backdropWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(backdropHtml)}`);
        this.backdropWindow.setIgnoreMouseEvents(true);
    }

    /**
     * Create the browser overlay window with navigation header
     */
    private createOverlayWindow(): void {
        if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
            Logger.info('OverlayHandler', 'Overlay window already exists');
            return;
        }

        // Get primary display dimensions
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.size;

        // Browser window size (85% of screen, max 1400x900)
        const browserWidth = Math.min(Math.floor(screenWidth * 0.85), 1400);
        const browserHeight = Math.min(Math.floor(screenHeight * 0.85), 900);

        // Center position
        const x = Math.floor((screenWidth - browserWidth) / 2);
        const y = Math.floor((screenHeight - browserHeight) / 2);

        Logger.info('OverlayHandler', `Creating overlay: ${browserWidth}x${browserHeight} at (${x}, ${y})`);

        // Create backdrop first
        this.createBackdropWindow();

        // Create the browser window
        this.overlayWindow = new BrowserWindow({
            width: browserWidth,
            height: browserHeight,
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
            backgroundColor: '#1b2838',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: false,
                preload: undefined,
            },
        });

        // Log events for debugging
        this.overlayWindow.webContents.on('did-start-loading', () => {
            Logger.info('OverlayHandler', 'Browser started loading');
        });

        this.overlayWindow.webContents.on('did-finish-load', () => {
            Logger.info('OverlayHandler', 'Browser finished loading');
            this.injectNavigationBar();
        });

        this.overlayWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            Logger.error('OverlayHandler', `Failed to load: ${errorCode} - ${errorDescription}`);
        });

        this.overlayWindow.webContents.on('render-process-gone', (event, details) => {
            Logger.error('OverlayHandler', `Renderer process gone: ${details.reason}`);
            this.overlayWindow = null;
        });

        // Handle Escape key to close overlay
        this.overlayWindow.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape' && input.type === 'keyDown') {
                Logger.info('OverlayHandler', 'Escape pressed - hiding overlay');
                this.hideOverlay();
            }
        });

        // Prevent close, just hide
        this.overlayWindow.on('close', (event) => {
            if (!this.overlayWindow?.isDestroyed()) {
                event.preventDefault();
                this.hideOverlay();
            }
        });

        // Handle links that try to open in new tab/window - load them in the same overlay
        this.overlayWindow.webContents.setWindowOpenHandler(({ url }) => {
            Logger.info('OverlayHandler', `Intercepted new window request: ${url}`);
            if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
                this.overlayWindow.webContents.loadURL(url);
            }
            return { action: 'deny' };
        });

        // Load the site directly
        Logger.info('OverlayHandler', `Loading URL: ${this.OVERLAY_URL}`);
        this.overlayWindow.loadURL(this.OVERLAY_URL);

        Logger.info('OverlayHandler', 'Overlay window created');
    }

    /**
     * Inject navigation bar into the page
     */
    private injectNavigationBar(): void {
        if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;

        const navBarCSS = `
            #blockycraft-nav-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                background: #1e1e1e;
                border-bottom: 1px solid #333333;
                display: flex;
                align-items: center;
                padding: 0 12px;
                gap: 8px;
                z-index: 999999;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
            }
            #blockycraft-nav-bar button {
                background: #2a2a2a;
                border: 1px solid #333333;
                color: #ffffff;
                padding: 6px 14px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
            }
            #blockycraft-nav-bar button:hover {
                background: #333333;
                border-color: #444444;
            }
            #blockycraft-nav-bar button:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
            #blockycraft-nav-bar .nav-title {
                color: #a1a1aa;
                font-size: 12px;
                margin-left: auto;
            }
            #blockycraft-nav-bar .close-btn {
                background: #f59e0b;
                border-color: #f59e0b;
                color: #000000;
                font-weight: 600;
            }
            #blockycraft-nav-bar .close-btn:hover {
                background: #d97706;
                border-color: #d97706;
            }
            body {
                padding-top: 40px !important;
            }
        `;

        const navBarHTML = `
            <div id="blockycraft-nav-bar">
                <button id="bc-back-btn" title="Voltar">← Voltar</button>
                <button id="bc-home-btn" title="Início">🏠 Início</button>
                <span class="nav-title">BlockyCRAFT Overlay • Shift+Tab para fechar</span>
                <button class="close-btn" id="bc-close-btn" title="Fechar">✕</button>
            </div>
        `;

        const injectScript = `
            (function() {
                // Remove existing nav bar if present
                const existing = document.getElementById('blockycraft-nav-bar');
                if (existing) existing.remove();

                // Add CSS
                const style = document.createElement('style');
                style.textContent = \`${navBarCSS.replace(/`/g, '\\`')}\`;
                document.head.appendChild(style);

                // Add nav bar
                document.body.insertAdjacentHTML('afterbegin', \`${navBarHTML.replace(/`/g, '\\`')}\`);

                // Button handlers
                document.getElementById('bc-back-btn').onclick = () => history.back();
                document.getElementById('bc-home-btn').onclick = () => window.location.href = '${this.OVERLAY_URL}';
                document.getElementById('bc-close-btn').onclick = () => window.close();

                // Update back button state
                const updateBackBtn = () => {
                    document.getElementById('bc-back-btn').disabled = history.length <= 1;
                };
                updateBackBtn();
            })();
        `;

        this.overlayWindow.webContents.executeJavaScript(injectScript).catch((err) => {
            Logger.error('OverlayHandler', `Failed to inject nav bar: ${err.message}`);
        });
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

        if (this.backdropWindow && !this.backdropWindow.isDestroyed()) {
            this.backdropWindow.show();
            this.backdropWindow.setAlwaysOnTop(true, 'screen-saver');
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
        if (this.backdropWindow && !this.backdropWindow.isDestroyed()) {
            this.backdropWindow.hide();
        }

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
