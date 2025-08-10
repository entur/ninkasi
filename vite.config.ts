import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Match the baseUrl from tsconfig.app.json
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      config: path.resolve(__dirname, './src/config'),
      store: path.resolve(__dirname, './src/store'),
      actions: path.resolve(__dirname, './src/actions'),
      reducers: path.resolve(__dirname, './src/reducers'),
      modals: path.resolve(__dirname, './src/modals'),
      screens: path.resolve(__dirname, './src/screens'),
      utils: path.resolve(__dirname, './src/utils'),
      models: path.resolve(__dirname, './src/models'),
      static: path.resolve(__dirname, './src/static'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
