import { render, screen } from '@testing-library/react';
import { lessons } from '../lib/data.js';
import { SITE_URL } from '../lib/site.js';

// next/font only works inside Next's own build, so the tests swap in a stand-in.
vi.mock('next/font/local', () => ({ default: () => ({ variable: 'font-stand-in' }) }));

// Variable imports, so a file you haven't written yet only fails its own test.
const load = (path) => import(path);

describe('pages and metadata', () => {
  it('the layout has a nav, a main area, a title template and an Open Graph JPG', async () => {
    const { default: RootLayout, metadata } = await load('../app/layout.jsx');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const doc = new DOMParser().parseFromString(renderToStaticMarkup(<RootLayout><p>Hi</p></RootLayout>), 'text/html');
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    const hrefs = [...doc.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/', '/lessons', '/contact']));
    expect(doc.querySelector('main').textContent).toBe('Hi');
    expect(metadata.title.template).toContain('%s');
    expect(metadata.metadataBase.href).toBe(`${SITE_URL}/`);
    expect(metadata.openGraph.images[0].url).toMatch(/\.(jpe?g|png)$/);
  });

  it('the lessons page links every lesson', async () => {
    const { default: LessonsPage } = await load('../app/lessons/page.jsx');
    render(<LessonsPage />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    for (const lesson of lessons) expect(hrefs).toContain(`/lessons/${lesson.slug}`);
  });

  it('a lesson page shows the lesson, and an unknown one is a 404', async () => {
    const { default: LessonPage } = await load('../app/lessons/[slug]/page.jsx');
    render(await LessonPage({ params: Promise.resolve({ slug: 'kids-camp' }) }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Kids camp');
    await expect(LessonPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow();
  });

  it('lesson pages get their own title and description', async () => {
    const { generateMetadata } = await load('../app/lessons/[slug]/page.jsx');
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'first-waves' }) });
    expect(meta.title).toBe('First waves');
    expect(meta.description).toContain('Beginner');
    expect((await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })).title).toBe('Lesson not found');
  });

  it('the sitemap lists every page and lesson, and robots points at it', async () => {
    const { default: sitemap } = await load('../app/sitemap.js');
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(3 + lessons.length);
    expect(urls).toContain(`${SITE_URL}/lessons/kids-camp`);
    const { default: robots } = await load('../app/robots.js');
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
