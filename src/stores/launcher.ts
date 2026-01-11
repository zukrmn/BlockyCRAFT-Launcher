import { writable } from 'svelte/store';

export type GameState = 'IDLE' | 'PREPARING' | 'DOWNLOADING' | 'LAUNCHING' | 'PLAYING' | 'ERROR';

export const gameState = writable<GameState>('IDLE');
export const downloadProgress = writable<number>(0);
export const statusMessage = writable<string>('');
export const logs = writable<string[]>([]);

export function addLog(message: string) {
    logs.update(l => {
        const newLogs = [...l, message];
        if (newLogs.length > 50) newLogs.shift();
        return newLogs;
    });
}
