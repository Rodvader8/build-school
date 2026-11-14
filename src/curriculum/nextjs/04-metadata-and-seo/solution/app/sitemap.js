import { SITE_URL } from '@/lib/site.js';
import { menu } from '@/lib/menu.js';

// Served at /sitemap.xml. Every URL must be absolute.
export default function sitemap() {
  const paths = ['/', '/menu', '/about', ...menu.map((item) => `/menu/${item.slug}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` }));
}
