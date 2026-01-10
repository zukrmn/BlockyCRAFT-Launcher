// Build script for Electron main and preload files using esbuild
import { build } from 'esbuild';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

async function buildElectron() {
  // Build main process
  await build({
    entryPoints: [join(projectRoot, 'electron/main.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: join(projectRoot, 'dist-electron/main.cjs'),
    external: ['electron'],
    format: 'cjs',
    sourcemap: true,
  });

  // Build preload script
  await build({
    entryPoints: [join(projectRoot, 'electron/preload.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: join(projectRoot, 'dist-electron/preload.cjs'),
    external: ['electron'],
    format: 'cjs',
    sourcemap: true,
  });

  console.log('✓ Electron files built successfully');
}

buildElectron().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
