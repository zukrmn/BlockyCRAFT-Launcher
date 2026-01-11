export {};

declare global {
  interface IElectronAPI {
    launchGame: (options: { username: string }) => void;
    onProgress: (callback: (data: { type: string; current: number; total: number }) => void) => void;
    onLog: (callback: (data: string) => void) => void;
    onError: (callback: (err: string) => void) => void;
  }

  interface Window {
    api: IElectronAPI;
  }
}
