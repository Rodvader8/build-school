// A dashboard's data module for Saltmarsh Bakehouse (invented): typed rows, typed lookups.
// Press Run to print the totals, then work through the numbered notes.

export const REGIONS = ['north', 'south', 'west'] as const;
export type Region = (typeof REGIONS)[number];

export interface SalesRow {
  month: string;
  region: Region;
  revenue: number;
  orders: number;
}

export const sales: SalesRow[] = [
  { month: 'Jan', region: 'north', revenue: 4200, orders: 310 },
  { month: 'Jan', region: 'south', revenue: 3100, orders: 240 },
  { month: 'Jan', region: 'west', revenue: 2800, orders: 205 },
  { month: 'Feb', region: 'north', revenue: 4650, orders: 342 },
  { month: 'Feb', region: 'south', revenue: 3350, orders: 251 },
  { month: 'Feb', region: 'west', revenue: 3020, orders: 230 },
  { month: 'Mar', region: 'north', revenue: 5100, orders: 377 },
  { month: 'Mar', region: 'south', revenue: 3480, orders: 266 },
  { month: 'Mar', region: 'west', revenue: 3190, orders: 241 },
];

export const targets: Record<Region, number> = {
  north: 4500,
  south: 3300,
  west: 3000,
};

export const palette = {
  north: '#1b7f79',
  south: '#c8501c',
  west: '#3a5bd0',
} satisfies Record<Region, string>;

export function totalsByRegion(rows: SalesRow[]): Record<Region, number> {
  const totals: Record<Region, number> = { north: 0, south: 0, west: 0 };
  for (const row of rows) totals[row.region] += row.revenue;
  return totals;
}

export function topRegion(totals: Record<Region, number>): Region {
  let best: Region = REGIONS[0];
  for (const region of REGIONS) if (totals[region] > totals[best]) best = region;
  return best;
}

console.log(totalsByRegion(sales), topRegion(totalsByRegion(sales)));
