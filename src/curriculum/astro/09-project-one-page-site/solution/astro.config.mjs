import { defineConfig, fontProviders } from 'astro/config';

// Both fonts are committed in src/assets/fonts. Nothing is fetched from Google.
export default defineConfig({
  site: 'https://harbourlight.example',
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'DM Serif Display',
      cssVariable: '--font-display',
      display: 'swap',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [{ src: ['./src/assets/fonts/dm-serif-display-latin-400-normal.woff2'], weight: 400, style: 'normal' }],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Figtree',
      cssVariable: '--font-body',
      display: 'swap',
      fallbacks: ['-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      options: {
        variants: [{ src: ['./src/assets/fonts/figtree-latin-wght-normal.woff2'], weight: '300 900', style: 'normal' }],
      },
    },
  ],
});
