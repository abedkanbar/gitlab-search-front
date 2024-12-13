import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: '/'
  },
  esbuild: {
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});