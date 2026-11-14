import { defineConfig, fontProviders } from 'astro/config';

// Both fonts are committed in src/assets/fonts. Nothing is fetched from Google at build or run time.
export default defineConfig({
  site: 'https://saltmarsh.example',
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      display: 'swap',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [{ src: ['./src/assets/fonts/instrument-serif-latin-400-normal.woff2'], weight: 400, style: 'normal' }],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Figtree',
      cssVariable: '--font-figtree',
      display: 'swap',
      fallbacks: ['-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      options: {
        variants: [{ src: ['./src/assets/fonts/figtree-latin-wght-normal.woff2'], weight: '300 900', style: 'normal' }],
      },
    },
  ],
});
