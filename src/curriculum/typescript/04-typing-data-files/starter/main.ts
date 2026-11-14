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
  // 1. Two rows have mistakes. Delete each @ts-expect-error line, read the error, fix the row.
  // @ts-expect-error TODO: a typo in the region
  { month: 'Jan', region: 'wets', revenue: 2800, orders: 205 },
  { month: 'Feb', region: 'north', revenue: 4650, orders: 342 },
  // @ts-expect-error TODO: revenue is a number, not text
  { month: 'Feb', region: 'south', revenue: '3350', orders: 251 },
  { month: 'Feb', region: 'west', revenue: 3020, orders: 230 },
  { month: 'Mar', region: 'north', revenue: 5100, orders: 377 },
  { month: 'Mar', region: 'south', revenue: 3480, orders: 266 },
  { month: 'Mar', region: 'west', revenue: 3190, orders: 241 },
];

// 2. Every region needs a monthly target. One is missing, and the type should catch that.
// @ts-expect-error TODO: delete this line, read the error, add the missing target (west: 3000)
export const targets: Record<Region, number> = {
  north: 4500,
  south: 3300,
};

// 3. Make the colours an exact-shape check with `satisfies Record<Region, string>`.
//    Then a missing region becomes an error, but each colour keeps its exact value.
export const palette = {
  north: '#1b7f79',
  south: '#c8501c',
  west: '#3a5bd0',
};

// 4. Total revenue per region. Return a Record<Region, number>.
export function totalsByRegion(rows: SalesRow[]) {
  return {};
}

// 5. The region with the most revenue. Its return type should be Region, not string.
export function topRegion(totals: Record<string, number>): string {
  return Object.keys(totals)[0] ?? '';
}

console.log(totalsByRegion(sales), topRegion(totalsByRegion(sales)));
