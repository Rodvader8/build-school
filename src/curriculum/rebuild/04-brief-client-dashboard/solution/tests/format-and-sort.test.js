import { change, changePoints, formatMoney, formatPercent } from '../src/format.js';
import { sortRows } from '../src/sort.js';

describe('formatting', () => {
  it('formats money in whole dollars with separators', () => {
    expect(formatMoney(116670)).toBe('$116,670');
  });

  it('formats a share as a percentage with one decimal', () => {
    expect(formatPercent(0.593)).toBe('59.3%');
  });

  it('describes a rise and a fall against the period before', () => {
    expect(change(110, 100)).toEqual({ text: '10.0%', up: true });
    expect(change(90, 100)).toEqual({ text: '10.0%', up: false });
    expect(changePoints(0.6, 0.55).up).toBe(true);
  });
});

describe('sortRows', () => {
  const rows = [
    { customer: 'Bell', orders: 9 },
    { customer: 'Ash', orders: 120 },
    { customer: 'Cove', orders: 30 },
  ];

  it('sorts numbers as numbers, not as text (120 comes after 30)', () => {
    expect(sortRows(rows, 'orders', 'asc').map((r) => r.orders)).toEqual([9, 30, 120]);
  });

  it('sorts text alphabetically, and reverses for desc', () => {
    expect(sortRows(rows, 'customer', 'asc').map((r) => r.customer)).toEqual(['Ash', 'Bell', 'Cove']);
    expect(sortRows(rows, 'customer', 'desc').map((r) => r.customer)).toEqual(['Cove', 'Bell', 'Ash']);
  });

  it('leaves the original list alone', () => {
    sortRows(rows, 'orders', 'asc');
    expect(rows[0].customer).toBe('Bell');
  });
});
