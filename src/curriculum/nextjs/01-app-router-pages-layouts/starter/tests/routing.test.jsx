import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { menu } from '../lib/menu.js';

// Pages are loaded inside each test, so one missing file only fails its own test.
const load = async (path) => (await import(path)).default;

describe('layouts and pages', () => {
  it('the root layout wraps pages in a header with Home, Menu and About links and a main area', async () => {
    const RootLayout = await load('../app/layout.jsx');
    const markup = renderToStaticMarkup(<RootLayout><p>Hello page</p></RootLayout>);
    const doc = new DOMParser().parseFromString(markup, 'text/html');
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    const hrefs = [...doc.querySelectorAll('header a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/', '/menu', '/about']));
    expect(doc.querySelector('main').textContent).toContain('Hello page');
  });

  it('the menu page links each item to /menu/<slug>', async () => {
    const MenuPage = await load('../app/menu/page.jsx');
    render(<MenuPage />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    for (const item of menu) expect(hrefs).toContain(`/menu/${item.slug}`);
  });

  it('an item page shows the name, price and description of the item', async () => {
    const ItemPage = await load('../app/menu/[slug]/page.jsx');
    render(await ItemPage({ params: Promise.resolve({ slug: 'rye' }) }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Seeded rye');
    expect(screen.getByText('$10')).toBeTruthy();
    expect(screen.getByText(/sunflower/)).toBeTruthy();
  });

  it('an unknown item calls notFound()', async () => {
    const ItemPage = await load('../app/menu/[slug]/page.jsx');
    await expect(ItemPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow();
  });
});
