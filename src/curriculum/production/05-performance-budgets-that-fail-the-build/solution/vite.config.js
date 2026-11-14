import { defineConfig } from 'vite';

// The built CSS goes straight into index.html, so no stylesheet blocks the first paint.
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

export default defineConfig({ plugins: [inlineCss] });
