import { defineConfig, fontProviders } from 'astro/config';

// Both fonts are committed in src/assets/fonts. Nothing is fetched from Google.
export default defineConfig({
  site: 'https://lanternhill.example',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      display: 'swap',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: { variants: [{ src: ['./src/assets/fonts/instrument-serif-latin-400-normal.woff2'], weight: 400, style: 'normal' }] },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-body',
      display: 'swap',
      fallbacks: ['-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      options: { variants: [{ src: ['./src/assets/fonts/geist-latin-wght-normal.woff2'], weight: '100 900', style: 'normal' }] },
    },
  ],
});
