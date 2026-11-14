import { render, screen, fireEvent, within } from '@testing-library/react';
import { menu } from '../lib/menu.js';

const load = async (path) => (await import(path)).default;
const publicItems = menu.map(({ supplierNote, ...rest }) => rest);

describe('server and client components', () => {
  it('the add button counts every click', async () => {
    const AddToOrder = await load('../components/AddToOrder.jsx');
    render(<AddToOrder name="Country sourdough" />);
    const button = screen.getByRole('button', { name: 'Add Country sourdough to order' });
    expect(screen.getByRole('status').textContent).toBe('In your order: 0');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.getByRole('status').textContent).toBe('In your order: 2');
  });

  it('the category buttons filter the cards', async () => {
    const MenuBrowser = await load('../components/MenuBrowser.jsx');
    render(<MenuBrowser items={publicItems} />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'Pastry' }));
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(3);
    expect(within(cards[0]).getByRole('heading').textContent).toBe('Butter croissant');
    expect(screen.getByRole('button', { name: 'Pastry' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('the menu page shows every item but never the supplier notes', async () => {
    const MenuPage = await load('../app/menu/page.jsx');
    const { container } = render(<MenuPage />);
    for (const item of menu) expect(container.textContent).toContain(item.name);
    expect(container.textContent).not.toContain('wholesale');
  });
});
