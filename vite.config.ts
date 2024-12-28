import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Default optimizer
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Shorten import paths
    },
  },
  server: {
    port: 3000, // Specify port for dev server
  },
});
