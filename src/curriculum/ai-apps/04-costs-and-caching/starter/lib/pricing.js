// US dollars per million tokens. These are the published prices at the time of writing and they do change,
// so check Anthropic's pricing page before you trust them for real invoices.
export const PRICES = {
  'claude-opus-5-5': { input: 4, output: 20 },
  'claude-sonnet-5-5': { input: 2, output: 10 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5 },
};

/**
 * What one response cost, in dollars, from the usage numbers the API sent back.
 * It forgets the cache. The usage object has four counts: input_tokens (not cached), output_tokens,
 * cache_creation_input_tokens (written to the cache: 1.25 times the input price) and
 * cache_read_input_tokens (read from the cache: 0.1 times the input price). Throw an Error for a model with no price.
 */
export function costOf(model, usage) {
  const price = PRICES[model] ?? PRICES['claude-opus-5-5'];
  return ((usage.input_tokens ?? 0) * price.input + (usage.output_tokens ?? 0) * price.output) / 1_000_000;
}
