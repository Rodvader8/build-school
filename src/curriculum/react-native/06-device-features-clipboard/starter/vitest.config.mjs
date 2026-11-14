import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const stub = (name) => fileURLToPath(new URL(`./tests/stubs/${name}.jsx`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // The tests run in a fake browser, so React Native's components come from react-native-web, the same library the web preview uses.
      'react-native': 'react-native-web',
      // Native-only Expo modules need a phone, so the tests swap in tiny stand-ins (see tests/stubs/).
      'expo-status-bar': stub('expo-status-bar'),
      'expo-clipboard': stub('expo-clipboard'),
    },
  },
  define: { __DEV__: 'true' }, // React Native code expects this global
  test: { environment: 'jsdom', globals: true, include: ['tests/**/*.test.jsx'] },
});
