// US dollars per million tokens. These are the published prices at the time of writing and they do change,
// so check Anthropic's pricing page before you trust them for real invoices.
export const PRICES = {
  'claude-opus-5-5': { input: 4, output: 20 },
  'claude-sonnet-5-5': { input: 2, output: 10 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5 },
};

// Writing a prompt into the cache costs a quarter more than normal input. Reading it back costs a tenth.
const CACHE_WRITE = 1.25;
const CACHE_READ = 0.1;

/** What one response cost, in dollars, from the usage numbers the API sent back. */
export function costOf(model, usage) {
  const price = PRICES[model];
  if (!price) throw new Error(`No price for model ${model}`);
  const input = usage.input_tokens ?? 0;
  const output = usage.output_tokens ?? 0;
  const written = usage.cache_creation_input_tokens ?? 0;
  const read = usage.cache_read_input_tokens ?? 0;
  // usage.input_tokens counts only the tokens that weren't cached. Cache writes and reads are reported separately.
  return (input * price.input + written * price.input * CACHE_WRITE + read * price.input * CACHE_READ + output * price.output) / 1_000_000;
}
