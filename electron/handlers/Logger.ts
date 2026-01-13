import { app } from 'electron';
import path from 'path';
import fs from 'fs';

/**
 * Persistent logger that writes to files in userData/logs/
 * Features:
 * - Auto-rotation (keeps last 7 days)
 * - Timestamp prefixes
 * - Separate game log file
 * - Global console interception
 */
class PersistentLogger {
    private logsDir: string;
    private launcherLogPath: string;
    private gameLogPath: string;
    private initialized: boolean = false;
    private readonly MAX_LOG_DAYS = 7;

    constructor() {
        // Will be set properly in init()
        this.logsDir = '';
        this.launcherLogPath = '';
        this.gameLogPath = '';
    }

    /**
     * Initialize the logger. Must be called after app is ready.
     */
    public init(): void {
        if (this.initialized) return;

        this.logsDir = path.join(app.getPath('userData'), 'logs');
        fs.mkdirSync(this.logsDir, { recursive: true });

        const dateStr = this.getDateString();
        this.launcherLogPath = path.join(this.logsDir, `launcher-${dateStr}.log`);
        this.gameLogPath = path.join(this.logsDir, `game-${dateStr}.log`);

        // Clean old logs
        this.rotateOldLogs();

        // Intercept console methods
        this.interceptConsole();

        this.initialized = true;
        this.info('Logger', '=== BlockyCRAFT Launcher Log Started ===');
        this.info('Logger', `Log file: ${this.launcherLogPath}`);
    }

    /**
     * Gets current date string in YYYY-MM-DD format
     */
    private getDateString(): string {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    /**
     * Gets current timestamp in ISO format
     */
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Formats a log message with timestamp and level
     */
    private formatMessage(level: string, tag: string, message: string): string {
        return `[${this.getTimestamp()}] [${level}] [${tag}] ${message}`;
    }

    /**
     * Writes a line to the launcher log file
     */
    private writeToLauncherLog(line: string): void {
        if (!this.initialized) return;
        try {
            fs.appendFileSync(this.launcherLogPath, line + '\n');
        } catch (e) {
            // Fallback to original console if file write fails
            process.stdout.write(`[LOG WRITE ERROR] ${e}\n`);
        }
    }

    /**
     * Writes a line to the game log file
     */
    public writeToGameLog(line: string): void {
        if (!this.initialized) return;
        try {
            fs.appendFileSync(this.gameLogPath, `[${this.getTimestamp()}] ${line}\n`);
        } catch (e) {
            process.stdout.write(`[GAME LOG WRITE ERROR] ${e}\n`);
        }
    }

    /**
     * Removes log files older than MAX_LOG_DAYS
     */
    private rotateOldLogs(): void {
        try {
            const files = fs.readdirSync(this.logsDir);
            const now = Date.now();
            const maxAge = this.MAX_LOG_DAYS * 24 * 60 * 60 * 1000;

            for (const file of files) {
                if (!file.endsWith('.log')) continue;

                const filePath = path.join(this.logsDir, file);
                const stats = fs.statSync(filePath);
                const age = now - stats.mtimeMs;

                if (age > maxAge) {
                    fs.unlinkSync(filePath);
                    process.stdout.write(`[Logger] Deleted old log: ${file}\n`);
                }
            }
        } catch (e) {
            process.stdout.write(`[Logger] Error rotating logs: ${e}\n`);
        }
    }

    /**
     * Intercepts console.log, console.error, console.warn
     */
    private interceptConsole(): void {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const self = this;

        console.log = function (...args: any[]) {
            const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            self.writeToLauncherLog(self.formatMessage('INFO', 'Console', message));
            originalLog.apply(console, args);
        };

        console.error = function (...args: any[]) {
            const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            self.writeToLauncherLog(self.formatMessage('ERROR', 'Console', message));
            originalError.apply(console, args);
        };

        console.warn = function (...args: any[]) {
            const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            self.writeToLauncherLog(self.formatMessage('WARN', 'Console', message));
            originalWarn.apply(console, args);
        };
    }

    // Public logging methods with tags

    public info(tag: string, message: string): void {
        const formatted = this.formatMessage('INFO', tag, message);
        this.writeToLauncherLog(formatted);
        process.stdout.write(formatted + '\n');
    }

    public error(tag: string, message: string): void {
        const formatted = this.formatMessage('ERROR', tag, message);
        this.writeToLauncherLog(formatted);
        process.stderr.write(formatted + '\n');
    }

    public warn(tag: string, message: string): void {
        const formatted = this.formatMessage('WARN', tag, message);
        this.writeToLauncherLog(formatted);
        process.stdout.write(formatted + '\n');
    }

    public debug(tag: string, message: string): void {
        const formatted = this.formatMessage('DEBUG', tag, message);
        this.writeToLauncherLog(formatted);
        // Debug only goes to file, not console (to reduce noise)
    }

    /**
     * Logs game output (stdout/stderr) to game log file
     */
    public game(stream: 'stdout' | 'stderr', line: string): void {
        const prefix = stream === 'stderr' ? '[ERR]' : '[OUT]';
        this.writeToGameLog(`${prefix} ${line}`);
    }

    /**
     * Returns the path to the logs directory
     */
    public getLogsDir(): string {
        return this.logsDir;
    }
}

// Singleton instance
export const Logger = new PersistentLogger();
