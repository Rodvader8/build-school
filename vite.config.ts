/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { buildSchoolApi } from './server/api.ts';

export default defineConfig({
  plugins: [react(), buildSchoolApi()],
  // Lesson and workspace pages are student files, not app entry points.
  optimizeDeps: { entries: ['index.html'] },
  server: {
    host: '127.0.0.1',
    port: 4780,
    strictPort: true,
    // Student files are saved here; watching them would reload the whole app on every keystroke.
    watch: { ignored: ['**/workspace/**'] },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // Cleaning up hundreds of throwaway lesson folders (some with node_modules) can take a while on a slow disk.
    hookTimeout: 180_000,
    // Lesson checks read computed styles and layout, so they run in real Chromium (one instance).
    browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
  },
});
