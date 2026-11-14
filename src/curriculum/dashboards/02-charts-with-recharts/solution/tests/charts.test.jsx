import { render, screen, within } from '@testing-library/react';
import { cloneElement } from 'react';
import { months } from '../src/data.js';
import { describeSeries } from '../src/chartData.js';
import { formatMoney } from '../src/format.js';
import RevenueChart from '../src/components/RevenueChart.jsx';
import LabourChart from '../src/components/LabourChart.jsx';

// ResponsiveContainer measures its parent, which is 0 by 0 in a test, so give it a fixed size instead.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, ResponsiveContainer: ({ children }) => cloneElement(children, { width: 720, height: 288 }) };
});

describe('describing a chart in words', () => {
  it('describeSeries names the highest and lowest points', () => {
    const text = describeSeries(months, 'revenue', 'Revenue by month', (v) => formatMoney(v));
    expect(text).toBe('Revenue by month. Highest in Dec at $84,200, lowest in Feb at $58,900.');
  });
});

describe('the revenue bar chart', () => {
  it('draws one bar per month', () => {
    const { container } = render(<RevenueChart data={months} />);
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(12);
  });

  it('starts the scale at zero, so bar heights are in proportion', () => {
    const { container } = render(<RevenueChart data={months} />);
    const ticks = [...container.querySelectorAll('.recharts-yAxis .recharts-cartesian-axis-tick-value')].map((t) => t.textContent);
    expect(ticks[0]).toBe('$0k');
    const heights = [...container.querySelectorAll('.recharts-bar-rectangle path')].map((p) => Number(p.getAttribute('height')));
    const jan = heights[0];
    const dec = heights[11];
    expect(dec / jan).toBeCloseTo(84200 / 61200, 1);
  });

  it('labels the months along the bottom and the dollars up the side', () => {
    const { container } = render(<RevenueChart data={months} />);
    const x = [...container.querySelectorAll('.recharts-xAxis .recharts-cartesian-axis-tick-value')].map((t) => t.textContent);
    expect(x).toEqual(months.map((m) => m.month));
    const y = [...container.querySelectorAll('.recharts-yAxis .recharts-cartesian-axis-tick-value')].map((t) => t.textContent);
    expect(y.every((t) => /^\$\d+k$/.test(t))).toBe(true);
  });

  it('is a named figure, with a one-sentence picture description', () => {
    render(<RevenueChart data={months} />);
    const figure = screen.getByRole('figure', { name: 'Revenue by month' });
    const picture = within(figure).getByRole('img');
    expect(picture.getAttribute('aria-label')).toMatch(/Highest in Dec at \$84,200/);
  });

  it('offers the same numbers as a table', () => {
    render(<RevenueChart data={months} />);
    const table = screen.getByRole('table', { name: 'Revenue by month', hidden: true });
    const rows = within(table).getAllByRole('row', { hidden: true });
    expect(rows).toHaveLength(13);
    expect(within(rows[1]).getAllByRole('cell', { hidden: true }).map((c) => c.textContent)).toEqual(['Jan', '$61,200']);
  });
});

describe('the labour line chart', () => {
  it('draws one line with a dot for every month', () => {
    const { container } = render(<LabourChart data={months} />);
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-line-dot')).toHaveLength(12);
  });

  it('marks the 30% target with a labelled reference line', () => {
    const { container } = render(<LabourChart data={months} />);
    expect(container.querySelectorAll('.recharts-reference-line')).toHaveLength(1);
    expect(container.textContent).toContain('Target 30%');
  });

  it('is a named figure with a description and a table', () => {
    render(<LabourChart data={months} />);
    const figure = screen.getByRole('figure', { name: 'Labour cost by month' });
    expect(within(figure).getByRole('img').getAttribute('aria-label')).toMatch(/Highest in Feb at 32\.4%, lowest in Oct at 27\.9%/);
    const table = within(figure).getByRole('table', { hidden: true });
    expect(within(table).getAllByRole('row', { hidden: true })).toHaveLength(13);
  });
});
