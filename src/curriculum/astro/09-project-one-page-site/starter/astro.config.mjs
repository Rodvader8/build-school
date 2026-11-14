import { defineConfig } from 'astro/config';

// Both fonts are committed in src/assets/fonts. Declare them here (lesson 5), with the
// CSS variables --font-display and --font-body. site.css already uses those names.
export default defineConfig({
  site: 'https://harbourlight.example',
  devToolbar: { enabled: false },
});
