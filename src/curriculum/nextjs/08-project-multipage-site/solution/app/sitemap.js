import { SITE_URL } from '@/lib/site.js';
import { lessons } from '@/lib/data.js';

export default function sitemap() {
  const paths = ['/', '/lessons', '/contact', ...lessons.map((lesson) => `/lessons/${lesson.slug}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` }));
}
