// The till maths for Saltmarsh Bakehouse, an invented bakery.
// Press Run to see it, then Check my work. Four spots are hiding a mistake.

export const shopName = 'Saltmarsh Bakehouse'; // inferred as string
export const gstRate = 0.1; // inferred as number
export const prices = [4.5, 6, 12.5]; // inferred as number[]

// 1. loafCount says it's a number, but somebody typed it as text.
// @ts-expect-error TODO: delete this line, read what tsc says, then fix the value
export const loafCount: number = '12';

export type Size = 'small' | 'large';

export function loafPrice(size: Size): number {
  return size === 'small' ? 4.5 : 8;
}

// 2. We sell a medium loaf now, at $6.50. Teach Size and loafPrice about it.
// @ts-expect-error TODO: delete this line once 'medium' is a valid Size
export const mediumPrice = loafPrice('medium');

// 3. cheapest() gets asked about empty lists too. Make its return type honest.
export function cheapest(list: number[]): number {
  // @ts-expect-error TODO: delete this line and read the error
  return list.length > 0 ? Math.min(...list) : undefined;
}

// 4. A quantity can arrive from a form (text) or from code (a number). Handle both.
export function toQuantity(raw: string | number): number {
  // @ts-expect-error TODO: a number has no .trim()
  return raw.trim() === '' ? 0 : Number(raw);
}

// 5. tsc is stricter in this project than in a loose one: list[0] might not exist.
export function firstPriceLabel(list: number[]): string {
  const first = list[0];
  return '$' + first.toFixed(2);
}

console.log(shopName, loafCount, cheapest(prices), toQuantity(' 3 '), firstPriceLabel(prices));
