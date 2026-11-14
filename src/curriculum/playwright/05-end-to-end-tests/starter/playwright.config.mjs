import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // TODO: workers: 1 and fullyParallel: false (one browser at a time, always)
  // TODO: use: { baseURL: 'http://127.0.0.1:4891' } so tests can write page.goto('/')
  // TODO: webServer: { command: 'node start-server.mjs', url: 'http://127.0.0.1:4891/', reuseExistingServer: false }
});
