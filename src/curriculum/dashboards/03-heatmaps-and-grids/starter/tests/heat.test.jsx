import { readFileSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { heatLevel, HEAT_CLASSES, HEAT_TEXT } from '../src/heat.js';
import HeatGrid from '../src/components/HeatGrid.jsx';
import HeatLegend from '../src/components/HeatLegend.jsx';
import OccupancyHeatmap from '../src/components/OccupancyHeatmap.jsx';
import LabourGrid from '../src/components/LabourGrid.jsx';

describe('the scale', () => {
  it('heatLevel puts a value into one of five equal slices of 0 to max', () => {
    expect(heatLevel(0, 100)).toBe(0);
    expect(heatLevel(19, 100)).toBe(0);
    expect(heatLevel(20, 100)).toBe(1);
    expect(heatLevel(50, 100)).toBe(2);
    expect(heatLevel(79, 100)).toBe(3);
    expect(heatLevel(80, 100)).toBe(4);
    expect(heatLevel(100, 100)).toBe(4);
    expect(heatLevel(5, 10, 3)).toBe(1);
  });

  it('heatLevel copes with negative, over-the-top and empty data', () => {
    expect(heatLevel(-5, 100)).toBe(0);
    expect(heatLevel(250, 100)).toBe(4);
    expect(heatLevel(0, 0)).toBe(0);
    expect(heatLevel(5, 0)).toBe(0);
  });
});

// The data cells only (the empty corner of the table is a <td> too).
const dataCells = (root = document) => [...root.querySelectorAll('td[data-level]')];

const small = {
  title: 'Tiny grid',
  rowLabels: ['A', 'B'],
  colLabels: ['Mon', 'Tue', 'Wed'],
  values: [[0, 50, 100], [10, 90, 25]],
  formatValue: (v) => `${v}%`,
  describe: (r, c, v) => `${r} on ${c}: ${v} percent`,
};

describe('the heat grid', () => {
  it('is a table with a caption, a header for each column and a header for each row', () => {
    render(<HeatGrid {...small} />);
    expect(screen.getByRole('table', { name: 'Tiny grid' })).toBeTruthy();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Mon', 'Tue', 'Wed']);
    expect(screen.getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['A', 'B']);
  });

  it('prints each value in its cell and describes it in words', () => {
    render(<HeatGrid {...small} />);
    const cells = dataCells();
    expect(cells).toHaveLength(6);
    expect(cells.map((c) => c.textContent)).toEqual(['0%', '50%', '100%', '10%', '90%', '25%']);
    expect(cells[1].getAttribute('aria-label')).toBe('A on Tue: 50 percent');
  });

  it('shades each cell by its share of the biggest value', () => {
    render(<HeatGrid {...small} />);
    const cells = dataCells();
    expect(cells.map((c) => c.getAttribute('data-level'))).toEqual(['0', '2', '4', '0', '4', '1']);
    expect(cells[2].className).toContain('bg-heat-4');
    expect(cells[2].className).toContain('text-ink');
    expect(cells[0].className).toContain('bg-heat-0');
    expect(cells[0].className).toContain('text-cream');
  });

  it('has a legend with five swatches that says which end is more', () => {
    const { container } = render(<HeatLegend lowLabel="Fewer" highLabel="More" />);
    const key = screen.getByRole('group', { name: /Fewer to More/ });
    const swatches = container.querySelectorAll('[data-swatch]');
    expect(swatches).toHaveLength(5);
    expect([...swatches].map((s) => HEAT_CLASSES.find((c) => s.className.includes(c)))).toEqual(HEAT_CLASSES);
    expect(key.textContent).toBe('FewerMore');
  });

  it('keeps the text readable: every step passes WCAG contrast', () => {
    const css = readFileSync('src/index.css', 'utf8');
    const colour = (name) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))[1];
    const luminance = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    HEAT_CLASSES.forEach((cls, i) => {
      const bg = luminance(colour(cls.replace('bg-', '')));
      const fg = luminance(colour(HEAT_TEXT[i].replace('text-', '')));
      expect((Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05)).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('the two grids on the dashboard', () => {
  it('the occupancy heatmap is 4 rooms by 7 days, with the busiest cell at the top step', () => {
    render(<OccupancyHeatmap />);
    const cells = dataCells(screen.getByRole('table', { name: 'Room occupancy by day' }));
    expect(cells).toHaveLength(28);
    const full = cells.filter((c) => c.textContent === '100%');
    expect(full).toHaveLength(1);
    expect(full[0].getAttribute('data-level')).toBe('4');
    expect(full[0].getAttribute('aria-label')).toBe('Terrace, Sat: 100% of seats booked');
  });

  it('the labour grid is 8 time blocks by 7 days, and describes staffing', () => {
    render(<LabourGrid />);
    const table = screen.getByRole('table', { name: 'Staff on the floor by time of day' });
    expect(dataCells(table)).toHaveLength(56);
    expect(within(table).getByRole('cell', { name: 'Fri at 5pm: 8 staff on the floor' })).toBeTruthy();
  });
});
