import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// A linked stylesheet blocks the first paint, so the built CSS is placed straight into index.html.
const inlineCss = {
  name: 'inline-css',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return html;
      return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (tag, href) => {
        const file = ctx.bundle[href.replace(/^\//, '')];
        return file ? `<style>${file.source}</style>` : tag;
      });
    },
  },
};

export default defineConfig({
  plugins: [react(), inlineCss],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{js,jsx}'],
  },
});
