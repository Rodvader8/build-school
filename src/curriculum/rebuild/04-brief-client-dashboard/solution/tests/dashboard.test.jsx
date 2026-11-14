import { cloneElement } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../src/App.jsx';
import { periods } from '../src/data.js';
import { formatMoney } from '../src/format.js';
import { describeSeries } from '../src/components/RevenueChart.jsx';

// ResponsiveContainer measures its parent, which is 0 by 0 in a test, so give it a fixed size.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, ResponsiveContainer: ({ children }) => cloneElement(children, { width: 720, height: 288 }) };
});

const tiles = () => screen.getAllByTestId('kpi');

describe('the period toggle and the tiles', () => {
  it('shows four tiles for the default period, with the revenue from the data', () => {
    render(<App />);
    expect(tiles()).toHaveLength(4);
    expect(tiles()[0].textContent).toContain(formatMoney(periods['30d'].revenue));
  });

  it('moves aria-pressed and changes the numbers when another period is chosen', () => {
    render(<App />);
    const group = screen.getByRole('group', { name: 'Period' });
    fireEvent.click(within(group).getByRole('button', { name: 'Last 7 days' }));
    expect(within(group).getByRole('button', { name: 'Last 7 days' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(group).getByRole('button', { name: 'Last 30 days' }).getAttribute('aria-pressed')).toBe('false');
    expect(tiles()[0].textContent).toContain(formatMoney(periods['7d'].revenue));
  });
});

describe('the customers table', () => {
  const firstColumn = () => within(screen.getByRole('table', { name: /Customers by orders/ })).getAllByRole('rowheader').map((c) => c.textContent);

  it('starts in the data order, unsorted', () => {
    render(<App />);
    expect(screen.getByRole('columnheader', { name: /Customer/ }).getAttribute('aria-sort')).toBe('none');
  });

  it('sorts ascending, then descending, and says so with aria-sort', () => {
    render(<App />);
    const header = screen.getByRole('columnheader', { name: /Customer/ });
    fireEvent.click(within(header).getByRole('button'));
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(firstColumn()).toEqual([...firstColumn()].sort((a, b) => a.localeCompare(b)));
    fireEvent.click(within(header).getByRole('button'));
    expect(header.getAttribute('aria-sort')).toBe('descending');
  });

  it('uses real buttons in the headers, so the keyboard works', () => {
    render(<App />);
    const buttons = within(screen.getByRole('table', { name: /Customers by orders/ })).getAllByRole('button');
    expect(buttons.length).toBe(4);
    expect(buttons.every((b) => b.tagName === 'BUTTON')).toBe(true);
  });
});

describe('the chart', () => {
  it('is a named figure with a one-sentence description', () => {
    render(<App />);
    const figure = screen.getByRole('figure', { name: /Revenue, last 30 days/ });
    expect(within(figure).getByRole('img').getAttribute('aria-label')).toBe(describeSeries(periods['30d'].series, 'Last 30 days'));
  });

  it('offers the same numbers as a table, one row per point', () => {
    render(<App />);
    const figure = screen.getByRole('figure', { name: /Revenue, last 30 days/ });
    const table = within(figure).getByRole('table', { hidden: true });
    expect(within(table).getAllByRole('row', { hidden: true })).toHaveLength(periods['30d'].series.length + 1);
  });
});
