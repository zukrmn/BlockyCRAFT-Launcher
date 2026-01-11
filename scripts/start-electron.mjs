#!/usr/bin/env node
// Startup script that launches Electron using the binary path directly
// AND temporarily renames node_modules/electron to prevent Node from
// resolving require('electron') to the npm package, allowing Electron's
// built-in module to be used instead.

import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, renameSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Paths for the npm electron module
const electronPkgPath = join(projectRoot, 'node_modules', 'electron');
const electronBackupPath = join(projectRoot, 'node_modules', '.electron-npm');

// Get the electron binary path from the npm package (before renaming)
function getElectronPath() {
  const pathFile = join(electronPkgPath, 'path.txt');

  if (existsSync(pathFile)) {
    const executablePath = readFileSync(pathFile, 'utf-8').trim();
    return join(electronPkgPath, 'dist', executablePath);
  }

  // Fallback to common location
  return join(electronPkgPath, 'dist', 'electron');
}

// Get absolute path to electron binary BEFORE renaming
const electronBinaryPath = getElectronPath();

// Temporarily rename the npm electron folder
function hideNpmElectron() {
  if (existsSync(electronPkgPath) && !existsSync(electronBackupPath)) {
    renameSync(electronPkgPath, electronBackupPath);
    console.log('[start-electron] Temporarily renamed node_modules/electron');
  }
}

// Restore the npm electron folder
function restoreNpmElectron() {
  if (existsSync(electronBackupPath) && !existsSync(electronPkgPath)) {
    renameSync(electronBackupPath, electronPkgPath);
    console.log('[start-electron] Restored node_modules/electron');
  }
}

// The electron binary path after renaming
const electronPathAfterRename = electronBinaryPath.replace(electronPkgPath, electronBackupPath);

// Build args for electron
// Use Wayland backend for GUI in Linux containers (more reliable than X11)
const args = [
  projectRoot,
  '--no-sandbox',
  '--disable-gpu',
  '--ozone-platform=wayland',  // Use Wayland instead of X11
];

// Add any extra args passed to this script
args.push(...process.argv.slice(2));

console.log(`Electron binary: ${electronBinaryPath}`);
console.log(`After rename: ${electronPathAfterRename}`);
console.log(`App path: ${projectRoot}`);
console.log(`Args: ${args.join(' ')}`);

// Hide npm electron folder before starting
hideNpmElectron();

// Create a clean env without ELECTRON_RUN_AS_NODE
const cleanEnv = { ...process.env };
delete cleanEnv.ELECTRON_RUN_AS_NODE;
cleanEnv.ELECTRON_DISABLE_SANDBOX = '1';

// Configure Wayland environment
cleanEnv.WAYLAND_DISPLAY = cleanEnv.WAYLAND_DISPLAY || 'wayland-0';
cleanEnv.XDG_RUNTIME_DIR = cleanEnv.XDG_RUNTIME_DIR || '/tmp';
// Keep DISPLAY as fallback for X11 if needed
if (!cleanEnv.DISPLAY) {
  cleanEnv.DISPLAY = ':0';
}

// Spawn electron process using the path in the renamed location
const electron = spawn(electronPathAfterRename, args, {
  stdio: 'inherit',
  env: cleanEnv,
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
