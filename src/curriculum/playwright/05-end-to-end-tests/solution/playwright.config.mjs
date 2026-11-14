import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // One browser at a time. Several Chromiums at once can run a laptop out of memory.
  workers: 1,
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4891' },
  // Starts the local page before the tests and stops it afterwards.
  webServer: { command: 'node start-server.mjs', url: 'http://127.0.0.1:4891/', reuseExistingServer: false },
});
