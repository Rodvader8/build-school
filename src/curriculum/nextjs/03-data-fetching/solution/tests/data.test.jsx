import { render, screen } from '@testing-library/react';

// "use cache" only works inside Next, so these tests stand in for next/cache and record how it's used.
const cache = vi.hoisted(() => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock('next/cache', () => cache);

const items = [
  { slug: 'a', name: 'Loaf A', category: 'bread', price: 1 },
  { slug: 'b', name: 'Bun B', category: 'pastry', price: 2 },
  { slug: 'c', name: 'Loaf C', category: 'bread', price: 3 },
];

describe('fetching data on the server', () => {
  it('groupByCategory groups items and keeps their order', async () => {
    const { groupByCategory } = await import('../lib/group.js');
    const groups = groupByCategory(items);
    expect(groups.map((g) => g.category)).toEqual(['bread', 'pastry']);
    expect(groups[0].items.map((i) => i.name)).toEqual(['Loaf A', 'Loaf C']);
  });

  it('groupByCategory gives each group a capitalised label', async () => {
    const { groupByCategory } = await import('../lib/group.js');
    expect(groupByCategory(items).map((g) => g.label)).toEqual(['Bread', 'Pastry']);
  });

  it('getMenu sets a cache lifetime and the menu tag', async () => {
    const { getMenu } = await import('../lib/bakery-api.js');
    const menu = await getMenu();
    expect(menu.length).toBeGreaterThan(3);
    expect(cache.cacheLife).toHaveBeenCalledWith('hours');
    expect(cache.cacheTag).toHaveBeenCalledWith('menu');
  });

  it('the menu page shows one section per category with every item', async () => {
    const { default: MenuPage } = await import('../app/menu/page.jsx');
    render(await MenuPage());
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Bread', 'Pastry']);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });
});
