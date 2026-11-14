import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../src/App.jsx';
import Header from '../src/components/Header.jsx';
import Footer from '../src/components/Footer.jsx';

describe('the page', () => {
  it('Header is a component with the site name and three nav links', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Kestrel Coffee');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getAllByRole('link')).toHaveLength(3);
  });

  it('Footer is a component that shows the current year', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo').textContent).toContain(String(new Date().getFullYear()));
  });

  it('App puts Header, main and Footer together', () => {
    render(<App />);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
  });

  it('the page still has exactly one h1', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('React has no complaints about the markup', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    const messages = spy.mock.calls.map((c) => String(c[0]) + ' ' + String(c[1] ?? ''));
    spy.mockRestore();
    expect(messages).toEqual([]);
  });
});
