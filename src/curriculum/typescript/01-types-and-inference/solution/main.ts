// The till maths for Saltmarsh Bakehouse, an invented bakery.
// Press Run to see it, then Check my work. Four spots are hiding a mistake.

export const shopName = 'Saltmarsh Bakehouse'; // inferred as string
export const gstRate = 0.1; // inferred as number
export const prices = [4.5, 6, 12.5]; // inferred as number[]

// 1. loafCount says it's a number, but somebody typed it as text.
export const loafCount: number = 12;

export type Size = 'small' | 'medium' | 'large';

export function loafPrice(size: Size): number {
  if (size === 'small') return 4.5;
  if (size === 'medium') return 6.5;
  return 8;
}

// 2. We sell a medium loaf now, at $6.50.
export const mediumPrice = loafPrice('medium');

// 3. cheapest() gets asked about empty lists too. Its return type says so.
export function cheapest(list: number[]): number | undefined {
  return list.length > 0 ? Math.min(...list) : undefined;
}

// 4. A quantity can arrive from a form (text) or from code (a number).
export function toQuantity(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  return raw.trim() === '' ? 0 : Number(raw);
}

// 5. list[0] might not exist, so check before using it.
export function firstPriceLabel(list: number[]): string {
  const first = list[0];
  if (first === undefined) return 'n/a';
  return '$' + first.toFixed(2);
}

console.log(shopName, loafCount, cheapest(prices), toQuantity(' 3 '), firstPriceLabel(prices));
