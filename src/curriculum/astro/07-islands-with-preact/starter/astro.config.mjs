import { defineConfig } from 'astro/config';

// TODO: Astro doesn't know how to render .jsx files yet. It needs the Preact integration.
export default defineConfig({
  site: 'https://saltmarsh.example',
  devToolbar: { enabled: false },
});
