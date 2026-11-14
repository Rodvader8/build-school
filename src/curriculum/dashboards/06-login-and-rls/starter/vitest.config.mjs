import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'],
    // Each test starts its own in-memory Postgres, which takes a moment on a slow laptop.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
