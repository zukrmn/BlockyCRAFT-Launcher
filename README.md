# BlockyCRAFT Launcher

An open-source Minecraft launcher built with modern web technologies and a nostalgic aesthetic.

![Launcher Preview](https://via.placeholder.com/800x450.png?text=BlockyCRAFT+Launcher)

## 🏗️ Tech Stack
- **Frontend**: [Svelte 5](https://svelte.dev/) (Reactive UI)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) (Utility-first) + Custom Pixel Art Aesthetics
- **Backend/Host**: [Electron](https://www.electronjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## ✨ Features
- **Modern Nostalgia UI**: A blend of modern glassmorphism with classic pixel-art fonts and layouts.
- **Isomorphic Core**: logic works in both Browser (Mock Mode) and Electron (Real Native Mode).
- **Reactive State**: Real-time progress bars and log streaming via Svelte 5 runes/stores.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation
```bash
npm install
```

### Running the Project
After installing dependencies, run:

```bash
npm run dev
```
This command builds the Electron app and starts the dev server. It will wait for the local server to be ready before launching the Electron window.

### Development
You can run the launcher in two modes:

#### 1. Full Electron Mode (Recommended)
Runs the full desktop application with the Node.js backend integration.
```bash
npm run dev
```

#### 2. Browser Mock Mode (UI Only)
Runs only the Svelte frontend in your browser. Useful for quick UI iteration without waiting for Electron to build.
```bash
npm run svelte:dev
```
*Note: In this mode, the download/launch process is simulated.*

## 📁 Project Structure
- `src/` - Svelte Frontend code.
  - `components/` - UI Components (LoginCard, ProgressBar...).
  - `stores/` - State management.
- `electron/` - Electron Backend code.
  - `main.ts` - Main process (Node.js).
  - `preload.ts` - IPC Bridge.

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
