import { menu } from '../lib/menu.js';
import { SITE_URL } from '../lib/site.js';

// Variable imports, so a missing file only fails its own test.
const load = (path) => import(path);

describe('metadata and SEO', () => {
  it('the layout sets a title template, a description and an Open Graph image', async () => {
    const { metadata } = await load('../app/layout.jsx');
    expect(metadata.metadataBase?.href).toBe(`${SITE_URL}/`);
    expect(metadata.title.template).toContain('%s');
    expect(metadata.description.length).toBeGreaterThan(20);
    const image = metadata.openGraph?.images?.[0]?.url ?? '';
    expect(image).toMatch(/\.(jpe?g|png)$/);
  });

  it('item pages get their own title and description from generateMetadata', async () => {
    const { generateMetadata } = await load('../app/menu/[slug]/page.jsx');
    const rye = await generateMetadata({ params: Promise.resolve({ slug: 'rye' }) });
    expect(rye.title).toBe('Seeded rye');
    expect(rye.description).toContain('Seeded rye');
    expect(rye.description).toContain('sunflower');
    const missing = await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) });
    expect(missing.title).toBe('Item not found');
  });

  it('the sitemap lists every page and menu item as an absolute URL', async () => {
    const { default: sitemap } = await load('../app/sitemap.js');
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(3 + menu.length);
    expect(urls.every((u) => u.startsWith(SITE_URL))).toBe(true);
    expect(urls).toContain(`${SITE_URL}/menu/rye`);
    expect(urls).toContain(`${SITE_URL}/about`);
  });

  it('robots.txt allows crawling and points at the sitemap', async () => {
    const { default: robots } = await load('../app/robots.js');
    const result = robots();
    expect(result.rules.allow).toBe('/');
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
