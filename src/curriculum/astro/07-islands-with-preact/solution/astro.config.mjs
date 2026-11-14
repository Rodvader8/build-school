import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://saltmarsh.example',
  devToolbar: { enabled: false },
  integrations: [preact()],
});
