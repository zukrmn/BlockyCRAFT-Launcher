#!/usr/bin/env node
// Startup script that launches Electron using the binary path directly
// AND temporarily removes the npm electron module to allow Electron's
// built-in 'electron' module to be resolved instead

import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, renameSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Paths for the npm electron module
const electronPkgPath = join(projectRoot, 'node_modules', 'electron');
const indexJsPath = join(electronPkgPath, 'index.js');
const indexJsBackupPath = join(electronPkgPath, 'index.js.disabled');
const pkgJsonPath = join(electronPkgPath, 'package.json');

let originalPkgJson = null;

// Get the electron binary path from the npm package
function getElectronPath() {
  const pathFile = join(electronPkgPath, 'path.txt');

  if (existsSync(pathFile)) {
    const executablePath = readFileSync(pathFile, 'utf-8').trim();
    return join(electronPkgPath, 'dist', executablePath);
  }

  // Fallback to common location
  return join(electronPkgPath, 'dist', 'electron');
}

// Temporarily disable the npm electron module
function disableNpmElectron() {
  // Rename index.js
  if (existsSync(indexJsPath)) {
    renameSync(indexJsPath, indexJsBackupPath);
  }

  // Remove main from package.json
  if (existsSync(pkgJsonPath)) {
    originalPkgJson = readFileSync(pkgJsonPath, 'utf-8');
    const pkg = JSON.parse(originalPkgJson);
    delete pkg.main;
    writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
  }

  console.log('[start-electron] Disabled npm electron module');
}

// Restore the npm electron module
function restoreNpmElectron() {
  // Restore index.js
  if (existsSync(indexJsBackupPath)) {
    renameSync(indexJsBackupPath, indexJsPath);
  }

  // Restore package.json
  if (originalPkgJson) {
    writeFileSync(pkgJsonPath, originalPkgJson);
  }

  console.log('[start-electron] Restored npm electron module');
}

const electronPath = getElectronPath();
const appPath = projectRoot;

// Build args for electron
const args = [appPath, '--no-sandbox', '--disable-gpu'];

// Add any extra args passed to this script
args.push(...process.argv.slice(2));

console.log(`Starting Electron: ${electronPath}`);
console.log(`App path: ${appPath}`);
console.log(`Args: ${args.join(' ')}`);

// Disable npm electron before starting
disableNpmElectron();

// Spawn electron process
const electron = spawn(electronPath, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_DISABLE_SANDBOX: '1',
  },
});

electron.on('close', (code) => {
  restoreNpmElectron();
  process.exit(code ?? 0);
});

electron.on('error', (err) => {
  restoreNpmElectron();
  console.error('Failed to start Electron:', err);
  process.exit(1);
});

// Handle cleanup on unexpected termination
process.on('SIGINT', () => {
  restoreNpmElectron();
  process.exit(0);
});

process.on('SIGTERM', () => {
  restoreNpmElectron();
  process.exit(0);
});
