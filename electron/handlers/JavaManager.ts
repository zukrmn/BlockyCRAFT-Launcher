import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import AdmZip from 'adm-zip';

const execAsync = promisify(exec);

// Compatible Java version range for Babric/Mixin on Beta 1.7.3
// Java 17 is the target; 18-21 are generally compatible.
// Java 22+ introduces breaking module/classloader changes that crash Mixin.
const JAVA_MIN_VERSION = 17;
const JAVA_MAX_VERSION = 21;

// Adoptium API base URL for Eclipse Temurin
const ADOPTIUM_API_BASE = 'https://api.adoptium.net/v3/binary/latest';
const JAVA_VERSION = '17';
const JVM_IMPL = 'hotspot';
const VENDOR = 'eclipse';

interface PlatformInfo {
    os: string;
    arch: string;
    extension: string;
    executablePath: string;
}

export class JavaManager {
    private javaDir: string;
    private markerFile: string;

    constructor() {
        this.javaDir = path.join(app.getPath('userData'), 'java');
        this.markerFile = path.join(this.javaDir, '.java17_installed');
    }

    /**
     * Ensures Java 17 is available, downloading it if necessary.
     * Returns the path to the java executable.
     */
    public async ensureJava(sender?: Electron.WebContents): Promise<string> {
        // 1. Check if we already have Java installed locally
        const localJavaPath = this.getLocalJavaPath();
        if (localJavaPath && fs.existsSync(localJavaPath)) {
            console.log('[JavaManager] Using locally installed Java:', localJavaPath);
            return localJavaPath;
        }

        // 2. Try to detect system Java
        const systemJava = await this.detectSystemJava();
        if (systemJava) {
            console.log('[JavaManager] Using system Java:', systemJava);
            return systemJava;
        }

        // 3. Download Java
        console.log('[JavaManager] No Java found, downloading...');
        return this.downloadAndInstallJava(sender);
    }

    /**
     * Detects if Java 17+ is available on the system PATH or common locations.
     */
    private async detectSystemJava(): Promise<string | null> {
        const javaPaths = this.getCommonJavaPaths();
        
        for (const javaPath of javaPaths) {
            if (await this.isValidJava17(javaPath)) {
                return javaPath;
            }
        }
        
        return null;
    }

    /**
     * Returns common Java installation paths based on OS.
     * IMPORTANT: Specific Java 17 paths are checked FIRST, before the generic
     * 'java' in PATH, to avoid accidentally using an incompatible newer version
     * (e.g. Java 25) that happens to be the system default.
     */
    private getCommonJavaPaths(): string[] {
        const specificPaths: string[] = [];
        
        const platform = process.platform;
        
        if (platform === 'win32') {
            const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
            const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
            
            // Common Windows Java 17 locations
            // Resolve glob patterns to actual paths
            const winGlobPatterns = [
                path.join(programFiles, 'Eclipse Adoptium', 'jdk-17*', 'bin', 'java.exe'),
                path.join(programFiles, 'Java', 'jdk-17*', 'bin', 'java.exe'),
                path.join(programFiles, 'Java', 'jre-17*', 'bin', 'java.exe'),
                path.join(programFiles, 'Temurin', 'jdk-17*', 'bin', 'java.exe'),
                path.join(programFilesX86, 'Java', 'jdk-17*', 'bin', 'java.exe'),
            ];
            
            for (const pattern of winGlobPatterns) {
                const resolved = this.resolveGlobPaths(pattern);
                specificPaths.push(...resolved);
            }
        } else if (platform === 'darwin') {
            // macOS Java 17 locations
            specificPaths.push(
                '/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java',
                '/Library/Java/JavaVirtualMachines/adoptopenjdk-17.jdk/Contents/Home/bin/java',
                '/usr/local/opt/openjdk@17/bin/java',
                '/opt/homebrew/opt/openjdk@17/bin/java',
            );
        } else {
            // Linux Java 17 locations
            specificPaths.push(
                '/usr/lib/jvm/temurin-17-jdk/bin/java',
                '/usr/lib/jvm/java-17-openjdk/bin/java',
                '/usr/lib/jvm/java-17-openjdk-amd64/bin/java',
                '/usr/lib/jvm/java-17-temurin/bin/java',
                '/opt/java/openjdk/bin/java',
            );
        }
        
        // Specific Java 17 paths first, then generic PATH as fallback
        return [...specificPaths, 'java'];
    }

    /**
     * Resolves glob patterns (e.g. jdk-17*) to actual file paths on disk.
     * Used for Windows where JDK directories have version suffixes like jdk-17.0.12.
     */
    private resolveGlobPaths(pattern: string): string[] {
        try {
            // Split at the glob wildcard
            const globIndex = pattern.indexOf('*');
            if (globIndex === -1) return [pattern];
            
            // Get the parent directory (before the wildcard segment)
            const beforeGlob = pattern.substring(0, globIndex);
            const parentDir = path.dirname(beforeGlob);
            const prefix = path.basename(beforeGlob); // e.g. "jdk-17"
            const afterGlob = pattern.substring(globIndex + 1); // e.g. "\bin\java.exe"
            
            if (!fs.existsSync(parentDir)) return [];
            
            const entries = fs.readdirSync(parentDir);
            const matches: string[] = [];
            
            for (const entry of entries) {
                if (entry.startsWith(prefix)) {
                    const fullPath = path.join(parentDir, entry) + afterGlob;
                    if (fs.existsSync(fullPath)) {
                        matches.push(fullPath);
                    }
                }
            }
            
            return matches;
        } catch {
            return [];
        }
    }

    /**
     * Checks if the given Java path is valid and within the compatible version range.
     * Babric/Mixin for Beta 1.7.3 requires Java 17-21.
     * Java 22+ (especially 25) breaks Mixin's classloader with module access changes.
     */
    public async isValidJava17(javaPath: string): Promise<boolean> {
        const version = await this.getJavaMajorVersion(javaPath);
        if (version === null) return false;
        return version >= JAVA_MIN_VERSION && version <= JAVA_MAX_VERSION;
    }

    /**
     * Gets the major version number of a Java installation.
     * Returns null if the path is invalid or version cannot be determined.
     */
    public async getJavaMajorVersion(javaPath: string): Promise<number | null> {
        try {
            const { stdout, stderr } = await execAsync(`"${javaPath}" -version`);
            const output = stdout + stderr; // Java writes version to stderr
            
            const versionMatch = output.match(/version "(\d+)/);
            if (versionMatch) {
                return parseInt(versionMatch[1], 10);
            }
            
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Gets platform info for Adoptium API.
     */
    private getPlatformInfo(): PlatformInfo {
        const platform = process.platform;
        const arch = process.arch;
        
        let os: string;
        let extension: string;
        let executablePath: string;
        
        switch (platform) {
            case 'win32':
                os = 'windows';
                extension = 'zip';
                executablePath = 'bin/java.exe';
                break;
            case 'darwin':
                os = 'mac';
                extension = 'tar.gz';
                executablePath = 'Contents/Home/bin/java';
                break;
            default:
                os = 'linux';
                extension = 'tar.gz';
                executablePath = 'bin/java';
        }
        
        let archStr: string;
        switch (arch) {
            case 'arm64':
                archStr = 'aarch64';
                break;
            case 'x64':
            default:
                archStr = 'x64';
        }
        
        return { os, arch: archStr, extension, executablePath };
    }

    /**
     * Gets the download URL for Adoptium JRE 17.
     */
    private getDownloadUrl(): { url: string; filename: string } {
        const info = this.getPlatformInfo();
        
        // Adoptium API URL pattern
        const url = `${ADOPTIUM_API_BASE}/${JAVA_VERSION}/ga/${info.os}/${info.arch}/jre/${JVM_IMPL}/normal/${VENDOR}`;
        const filename = `temurin-17-jre.${info.extension}`;
        
        return { url, filename };
    }

    /**
     * Gets the path to the locally installed Java executable.
     */
    private getLocalJavaPath(): string | null {
        if (!fs.existsSync(this.markerFile)) {
            return null;
        }
        
        const info = this.getPlatformInfo();
        
        // Find the extracted JRE directory
        if (!fs.existsSync(this.javaDir)) {
            return null;
        }
        
        const entries = fs.readdirSync(this.javaDir);
        const jreDir = entries.find(e => 
            e.startsWith('jdk-17') && 
            fs.statSync(path.join(this.javaDir, e)).isDirectory()
        );
        
        if (!jreDir) {
            return null;
        }
        
        const javaPath = path.join(this.javaDir, jreDir, info.executablePath);
        
        if (fs.existsSync(javaPath)) {
            return javaPath;
        }
        
        return null;
    }

    /**
     * Forces download and installation of Java 17 JRE, bypassing system detection.
     * Used as a last resort when the system Java is incompatible (e.g. Java 25).
     */
    public async forceDownloadJava(sender?: Electron.WebContents): Promise<string> {
        console.log('[JavaManager] Force downloading Java 17 (system Java incompatible)...');
        return this.downloadAndInstallJava(sender);
    }

    /**
     * Downloads and installs Java 17 JRE.
     */
    private async downloadAndInstallJava(sender?: Electron.WebContents): Promise<string> {
        const { url, filename } = this.getDownloadUrl();
        const info = this.getPlatformInfo();
        
        // Ensure java directory exists
        fs.mkdirSync(this.javaDir, { recursive: true });
        
        const archivePath = path.join(this.javaDir, filename);
        
        // Download the JRE
        this.sendProgress(sender, 'Baixando Java 17...', 0);
        console.log('[JavaManager] Downloading from:', url);
        
        try {
            const response = await fetch(url, { redirect: 'follow' });
            
            if (!response.ok) {
                throw new Error(`Failed to download Java: ${response.status} ${response.statusText}`);
            }
            
            const total = Number(response.headers.get('content-length')) || 0;
            const fileStream = createWriteStream(archivePath);
            
            if (!response.body) {
                throw new Error('No response body');
            }
            
            const reader = response.body.getReader();
            let downloaded = 0;
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                fileStream.write(Buffer.from(value));
                downloaded += value.length;
                
                if (total > 0) {
                    const percent = Math.round((downloaded / total) * 50); // 0-50% for download
                    this.sendProgress(sender, `Baixando Java 17... (${this.formatSize(downloaded)}/${this.formatSize(total)})`, percent);
                }
            }
            
            fileStream.end();
            
            // Wait for file to be fully written
            await new Promise<void>((resolve, reject) => {
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
            });
            
            console.log('[JavaManager] Download complete:', archivePath);
            
        } catch (e: any) {
            // Cleanup on failure
            if (fs.existsSync(archivePath)) {
                fs.unlinkSync(archivePath);
            }
            throw new Error(`Failed to download Java: ${e.message}`);
        }
        
        // Extract the archive
        this.sendProgress(sender, 'Extraindo Java 17...', 55);
        console.log('[JavaManager] Extracting...');
        
        try {
            if (info.extension === 'zip') {
                // Windows: Use AdmZip
                const zip = new AdmZip(archivePath);
                zip.extractAllTo(this.javaDir, true);
            } else {
                // Linux/macOS: Use tar
                await execAsync(`tar -xzf "${archivePath}" -C "${this.javaDir}"`);
            }
            
            // Create marker file
            fs.writeFileSync(this.markerFile, new Date().toISOString());
            
            // Cleanup archive
            fs.unlinkSync(archivePath);
            
        } catch (e: any) {
            throw new Error(`Failed to extract Java: ${e.message}`);
        }
        
        // Find and return the java executable path
        const javaPath = this.getLocalJavaPath();
        
        if (!javaPath) {
            throw new Error('Java extraction failed: executable not found');
        }
        
        // Make executable on Unix systems
        if (process.platform !== 'win32') {
            await execAsync(`chmod +x "${javaPath}"`);
        }
        
        this.sendProgress(sender, 'Java 17 instalado!', 60);
        console.log('[JavaManager] Java installed at:', javaPath);
        
        return javaPath;
    }

    /**
     * Sends progress update to the renderer.
     */
    private sendProgress(sender: Electron.WebContents | undefined, status: string, progress: number) {
        if (sender) {
            sender.send('launch-progress', { status, progress });
        }
    }

    /**
     * Formats bytes to human-readable size.
     */
    private formatSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}
