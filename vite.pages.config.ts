// Static build for GitHub Pages: same landing, no server. The contact form runs in simulated mode.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'static',
  publicDir: '../public',
  base: process.env.PAGES_BASE ?? '/la-pausa/',
  plugins: [react()],
  css: { postcss: {} },
  define: { 'process.env.NEXT_PUBLIC_STATIC_DEMO': JSON.stringify('1') },
  build: { outDir: '../dist-pages', emptyOutDir: true },
});
