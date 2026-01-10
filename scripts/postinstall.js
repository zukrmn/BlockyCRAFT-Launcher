// Postinstall script to patch the npm electron module
// This allows require('electron') to work correctly when running inside Electron
const fs = require('fs');
const path = require('path');

const electronIndexPath = path.join(__dirname, 'node_modules', 'electron', 'index.js');

const patchedContent = `const fs = require('fs');
const path = require('path');

// Check if we're running inside Electron's process (not just Node.js)
if (process.versions.electron && process.type === 'browser') {
  // We're in Electron's main process - the 'electron' module is a built-in
  // Export an empty object that will be replaced by Electron's internal require
  module.exports = {};
} else if (process.versions.electron && process.type === 'renderer') {
  // We're in Electron's renderer process
  module.exports = {};
} else if (process.versions.electron) {
  // Electron is running but process.type might not be set yet
  // Return empty object that will be properly initialized by Electron
  module.exports = {};
} else {
  // We're in Node.js - return the path to electron executable (original behavior)
  const pathFile = path.join(__dirname, 'path.txt');

  function getElectronPath () {
    let executablePath;
    if (fs.existsSync(pathFile)) {
      executablePath = fs.readFileSync(pathFile, 'utf-8');
    }
    if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
      return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || 'electron');
    }
    if (executablePath) {
      return path.join(__dirname, 'dist', executablePath);
    } else {
      throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
    }
  }

  module.exports = getElectronPath();
}
`;

try {
  fs.writeFileSync(electronIndexPath, patchedContent);
  console.log('✓ Patched node_modules/electron/index.js for Electron runtime compatibility');
} catch (err) {
  console.error('Failed to patch electron module:', err.message);
  // Don't fail the install, just warn
}
