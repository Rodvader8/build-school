import { SITE_URL } from '@/lib/site.js';

// Served at /robots.txt.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
