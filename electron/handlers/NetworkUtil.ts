import { net } from 'electron';

export interface FetchOptions {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
    maxRetries?: number;
}

/**
 * Robust fetch utility using Electron's net.fetch with timeout and retries.
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
    const { 
        method = 'GET', 
        body, 
        headers = {}, 
        timeoutMs = 10000, 
        maxRetries = 3 
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort(new Error(`Fetch timeout after ${timeoutMs}ms`));
        }, timeoutMs);

        try {
            if (attempt > 0) {
                console.log(`[NetworkUtil] Retrying fetch to ${url} (Attempt ${attempt}/${maxRetries})...`);
                // Exponential backoff: 1s, 2s, 4s...
                await new Promise(r => setTimeout(r, Math.pow(2, attempt - 1) * 1000));
            }

            const response = await net.fetch(url, {
                method,
                body,
                headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok && attempt < maxRetries) {
                // If it's a server error (5xx), retry. If it's a client error (4xx), don't retry unless it's 429
                if (response.status >= 500 || response.status === 429) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            return response;
        } catch (e: any) {
            clearTimeout(timeoutId);
            lastError = e;
            console.warn(`[NetworkUtil] Fetch to ${url} failed: ${e.message}`);
            
            if (attempt === maxRetries) {
                break;
            }
        }
    }

    throw lastError || new Error(`Failed to fetch ${url} after ${maxRetries} retries`);
}

/**
 * Robust JSON fetch utility.
 */
export async function fetchJsonWithRetry<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetchWithRetry(url, options);
    if (!response.ok) {
        throw new Error(`Failed to fetch JSON from ${url}: HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json() as T;
}
