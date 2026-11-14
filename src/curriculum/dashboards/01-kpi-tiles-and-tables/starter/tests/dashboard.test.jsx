import { render, screen, within } from '@testing-library/react';
import { formatMoney, formatPercent, changePct } from '../src/format.js';
import KpiTile from '../src/components/KpiTile.jsx';
import DataTable from '../src/components/DataTable.jsx';
import App from '../src/App.jsx';

describe('formatting numbers', () => {
  it('formatMoney adds the dollar sign, commas and the right decimals', () => {
    expect(formatMoney(835800)).toBe('$835,800');
    expect(formatMoney(39.2394, 2)).toBe('$39.24');
    expect(formatMoney(-1200)).toMatch(/^-\$1,200$/);
  });

  it('formatPercent rounds to one decimal by default', () => {
    expect(formatPercent(29.0739)).toBe('29.1%');
    expect(formatPercent(3.3255, 2)).toBe('3.33%');
  });

  it('changePct gives the percentage change, and 0 when there was nothing before', () => {
    expect(changePct(110, 100)).toBeCloseTo(10);
    expect(changePct(90, 100)).toBeCloseTo(-10);
    expect(changePct(50, 0)).toBe(0);
  });
});

describe('the KPI tile', () => {
  it('shows its label and its value', () => {
    render(<KpiTile label="Revenue" value="$1,000" change={5} />);
    expect(screen.getByRole('heading', { name: 'Revenue' })).toBeTruthy();
    expect(screen.getByText('$1,000')).toBeTruthy();
  });

  it('says Up or Down in words, with the arrow hidden from screen readers', () => {
    const { container, rerender } = render(<KpiTile label="Revenue" value="$1" change={3.3255} />);
    expect(screen.getByText(/Up 3\.3% on last month/)).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    rerender(<KpiTile label="Revenue" value="$1" change={-1.25} />);
    expect(screen.getByText(/Down 1\.3% on last month|Down 1\.2% on last month/)).toBeTruthy();
    rerender(<KpiTile label="Revenue" value="$1" change={0} />);
    expect(screen.getByText(/No change on last month/)).toBeTruthy();
  });

  it('judges good or bad by what the number is: a rise in cost is bad news', () => {
    const { container, rerender } = render(<KpiTile label="Revenue" value="$1" change={4} />);
    const tone = () => container.querySelector('section').getAttribute('data-tone');
    expect(tone()).toBe('good');
    rerender(<KpiTile label="Labour cost" value="29%" change={4} goodWhenUp={false} />);
    expect(tone()).toBe('bad');
    rerender(<KpiTile label="Labour cost" value="29%" change={-4} goodWhenUp={false} />);
    expect(tone()).toBe('good');
    rerender(<KpiTile label="Revenue" value="$1" change={0} />);
    expect(tone()).toBe('neutral');
  });
});

describe('the data table', () => {
  const columns = [
    { key: 'name', label: 'Venue' },
    { key: 'revenue', label: 'Revenue', numeric: true, format: (v) => `$${v}` },
    { key: 'covers', label: 'Covers', numeric: true },
  ];
  const rows = [
    { id: 'a', name: 'Alpha', revenue: 100, covers: 10 },
    { id: 'b', name: 'Beta', revenue: 250, covers: 30 },
  ];

  it('has a caption and a column header for each column', () => {
    render(<DataTable caption="Sales by venue" columns={columns} rows={rows} />);
    expect(screen.getByRole('table', { name: 'Sales by venue' })).toBeTruthy();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Venue', 'Revenue', 'Covers']);
  });

  it('starts every row with a row header', () => {
    render(<DataTable caption="Sales" columns={columns} rows={rows} />);
    expect(screen.getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['Alpha', 'Beta']);
  });

  it('right-aligns numbers with tabular figures, and formats them', () => {
    render(<DataTable caption="Sales" columns={columns} rows={rows} />);
    const cell = screen.getByText('$250');
    expect(cell.className).toMatch(/text-right/);
    expect(cell.className).toMatch(/tabular-nums/);
    expect(screen.getByText('30').className).toMatch(/text-right/);
  });

  it('adds a Total row when totals are given', () => {
    render(<DataTable caption="Sales" columns={columns} rows={rows} totals={{ revenue: 350, covers: 40 }} />);
    const footer = screen.getAllByRole('rowgroup').at(-1);
    expect(within(footer).getByRole('rowheader').textContent).toBe('Total');
    expect(within(footer).getByText('$350')).toBeTruthy();
    expect(within(footer).getByText('40')).toBeTruthy();
  });
});

describe('the dashboard', () => {
  it('shows four tiles with the real numbers and a row for each venue', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent).slice(0, 4)).toEqual(['Revenue', 'Covers', 'Spend per cover', 'Labour cost']);
    expect(screen.getAllByText('$835,800').length).toBeGreaterThan(0);
    expect(screen.getByText('$39.24')).toBeTruthy();
    expect(screen.getAllByText('29.1%').length).toBeGreaterThan(0);
    expect(screen.getByText(/Up 1\.9% on last month/).closest('section').getAttribute('data-tone')).toBe('bad');
    expect(screen.getAllByRole('row')).toHaveLength(1 + 3 + 1);
  });
});
