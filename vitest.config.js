import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'app': path.resolve(__dirname, './src/app'),
      'config': path.resolve(__dirname, './src/config'),
      'store': path.resolve(__dirname, './src/store'),
      'actions': path.resolve(__dirname, './src/actions'),
      'reducers': path.resolve(__dirname, './src/reducers'),
      'modals': path.resolve(__dirname, './src/modals'),
      'screens': path.resolve(__dirname, './src/screens'),
      'utils': path.resolve(__dirname, './src/utils'),
      'models': path.resolve(__dirname, './src/models'),
      'static': path.resolve(__dirname, './src/static'),
    }
  },
});