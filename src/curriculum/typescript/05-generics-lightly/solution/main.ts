// Generics, lightly: three small helpers every site ends up needing.
// They work, but they all say "any", which switches the checker off. Replace each any.

// 1. The first item, or undefined when the list is empty.
export function firstOf<T>(items: T[]): T | undefined {
  return items[0];
}

// 2. Group items by a key your callback works out.
export function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

// 3. A result that either worked (with a value) or failed (with a message).
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePrice(text: string): Result<number> {
  const n = Number(text.replace(/[$,\s]/g, ''));
  if (text.trim() === '' || Number.isNaN(n)) return { ok: false, error: `"${text}" is not a price` };
  return { ok: true, value: n };
}

export function mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
  return result.ok ? { ok: true, value: fn(result.value) } : result;
}

console.log(firstOf([3, 4]), groupBy(['apple', 'avocado', 'bread'], (s) => s[0] ?? ''), parsePrice('$4.50'));
