// Generics, lightly: three small helpers every site ends up needing.
// They work, but they all say "any", which switches the checker off. Replace each any.

// 1. The first item, or undefined when the list is empty.
//    Make it generic: firstOf<T>(items: T[]): T | undefined
export function firstOf(items: any[]): any {
  return items[0];
}

// 2. Group items by a key your callback works out.
//    groupBy(['apple', 'avocado', 'bread'], (s) => s[0]) gives { a: ['apple', 'avocado'], b: ['bread'] }
//    Make it generic in the item type T and the key type K (K extends string).
export function groupBy(items: any[], getKey: (item: any) => string): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

// 3. A result that either worked (with a value) or failed (with a message).
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// parsePrice('$4.50') gives { ok: true, value: 4.5 }. parsePrice('free') gives { ok: false, error: '...' }.
export function parsePrice(text: string): Result<number> {
  return { ok: true, value: 0 };
}

// mapResult changes the value inside a good result, and passes a failure straight through.
// Give it two type parameters, T (what's in) and U (what comes out).
export function mapResult(result: Result<any>, fn: (value: any) => any): Result<any> {
  return result;
}

console.log(firstOf([3, 4]), groupBy(['apple', 'avocado', 'bread'], (s) => s[0] ?? ''), parsePrice('$4.50'));
