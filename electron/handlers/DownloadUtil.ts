import fs from 'fs';
import path from 'path';

export interface DownloadOptions {
    urls: string[];
    destPath: string;
    progressCallback?: (status: string, percent: number) => void;
    maxRetries?: number;
    timeoutMs?: number; // Inactivity timeout
}

/**
 * Downloads a file with resuming capabilities using HTTP Range requests.
 */
export async function downloadFileResilient(options: DownloadOptions): Promise<void> {
    const { urls, destPath, progressCallback, maxRetries = 10, timeoutMs = 20000 } = options;
    const filename = path.basename(destPath);
    progressCallback?.(`Baixando ${filename}...`, 0);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    let lastError: Error | null = null;

    for (let i = 0; i < urls.length; i++) {
        const tryUrl = urls[i];
        console.log(`[DownloadUtil] Downloading from URL ${i + 1}/${urls.length}: ${tryUrl}`);

        let attempt = 0;
        let downloaded = 0;

        // Check if file exists to resume
        if (fs.existsSync(destPath)) {
            const stats = fs.statSync(destPath);
            downloaded = stats.size;
            if (downloaded > 0) {
                console.log(`[DownloadUtil] Found existing file ${destPath} with ${downloaded} bytes. Attempting to resume.`);
            }
        }

        while (attempt < maxRetries) {
            try {
                const headers: Record<string, string> = {};
                if (downloaded > 0) {
                    headers['Range'] = `bytes=${downloaded}-`;
                }

                const abortController = new AbortController();
                const timeoutId = setTimeout(() => {
                    abortController.abort(new Error('Inactivity timeout'));
                }, timeoutMs);

                const response = await fetch(tryUrl, {
                    headers,
                    signal: abortController.signal
                });

                if (!response.ok) {
                    // If resuming is not supported (e.g., 416 Range Not Satisfiable or 403),
                    // we should probably restart the file from 0.
                    if (response.status === 416 || (downloaded > 0 && response.status !== 206)) {
                        console.warn(`[DownloadUtil] Server does not support resume or range is invalid (Status ${response.status}). Restarting from 0.`);
                        downloaded = 0;
                        clearTimeout(timeoutId);
                        continue; // try again from 0
                    }
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const isPartial = response.status === 206;
                // If we asked for partial but got 200, it means resume is not supported. Restart from 0.
                if (downloaded > 0 && !isPartial) {
                    console.warn(`[DownloadUtil] Requested partial but got 200 OK. Resuming not supported. Restarting from 0.`);
                    downloaded = 0;
                }

                const contentLengthRaw = response.headers.get('content-length');
                const contentLength = Number(contentLengthRaw) || 0;
                let total = contentLength > 0 ? downloaded + contentLength : 0;

                // Handle the case where Content-Range tells us the real total
                const contentRange = response.headers.get('content-range');
                if (contentRange) {
                    const match = contentRange.match(/\/(\d+)$/);
                    if (match) {
                        total = Number(match[1]);
                    }
                }

                if (!response.body) {
                    throw new Error('No response body');
                }

                // If restarting from 0, open write stream with 'w'. If partial, open with 'a'.
                const flags = downloaded > 0 && isPartial ? 'a' : 'w';
                const fileStream = fs.createWriteStream(destPath, { flags });

                const reader = response.body.getReader();

                let readPromise: Promise<any>;
                let readDone = false;

                const readNext = async () => {
                    try {
                        const result = await reader.read();
                        return result;
                    } catch (err) {
                        throw err;
                    }
                };

                while (true) {
                    // Reset timeout on every read iteration
                    clearTimeout(timeoutId);
                    const currentTimeoutId = setTimeout(() => {
                        abortController.abort(new Error('Stream inactivity timeout'));
                    }, timeoutMs);

                    readPromise = readNext();

                    try {
                        const { done, value } = await readPromise;
                        clearTimeout(currentTimeoutId);

                        if (done) {
                            readDone = true;
                            break;
                        }

                        fileStream.write(Buffer.from(value));
                        downloaded += value.length;

                        if (total > 0) {
                            const percent = Math.round((downloaded / total) * 100);
                            progressCallback?.(`Baixando ${filename}...`, percent);
                        } else {
                            progressCallback?.(`Baixando ${filename} (${formatSize(downloaded)})...`, 0);
                        }

                    } catch (readErr: any) {
                        clearTimeout(currentTimeoutId);
                        fileStream.close();
                        if (abortController.signal.reason?.message === 'Stream inactivity timeout' || readErr.name === 'AbortError') {
                            throw new Error('Stream inactivity timeout during read');
                        }
                        throw readErr;
                    }
                }

                fileStream.end();

                // Wait for file to finish writing
                await new Promise<void>((resolve, reject) => {
                    fileStream.on('finish', resolve);
                    fileStream.on('error', reject);
                });

                if (readDone) {
                    // Check if total matches downloaded (if total was known)
                    if (total > 0 && downloaded < total) {
                        throw new Error(`Connection closed prematurely. Downloaded ${downloaded}/${total} bytes.`);
                    }

                    console.log(`[DownloadUtil] Downloaded ${filename} (${formatSize(downloaded)}) successfully.`);
                    return; // Success, exit function
                }

            } catch (e: any) {
                console.warn(`[DownloadUtil] Attempt ${attempt + 1}/${maxRetries} failed:`, e.message);
                lastError = e;
                attempt++;

                if (attempt < maxRetries) {
                    const delay = 2000;
                    progressCallback?.(`Conexão instável... Retentando (${attempt}/${maxRetries})`, Math.round(downloaded)); // Progress callback might just indicate retry
                    console.log(`[DownloadUtil] Waiting ${delay}ms before retrying...`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        // If it fails on this URL, move to the next URL
    }

    // All URLs failed
    throw lastError || new Error(`Failed to download ${filename} after multiple attempts and fallbacks`);
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
