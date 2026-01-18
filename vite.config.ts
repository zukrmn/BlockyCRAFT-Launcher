import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './', // Important for Electron to load assets correctly
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'esnext',
  },
  resolve: {
    conditions: ['browser'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4321,
    strictPort: true,
  },
})
