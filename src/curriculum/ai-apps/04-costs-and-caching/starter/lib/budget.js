import { PRICES } from '@/lib/pricing.js';

export class BudgetError extends Error {
  constructor(estimateUsd, limitUsd) {
    super(`This request could cost up to $${estimateUsd.toFixed(4)}, over the limit of $${limitUsd.toFixed(4)}.`);
    this.estimateUsd = estimateUsd;
    this.limitUsd = limitUsd;
  }
}

/** The most MAX_REQUEST_USD allows one request to cost. Read each time, so the tests can change it. */
export const limitUsd = () => Number(process.env.MAX_REQUEST_USD ?? 0.1);

/**
 * Worst-case cost of a request, worked out BEFORE sending it. Count the input exactly with
 * claude.messages.countTokens({ model, system, messages }), which returns { input_tokens } and doesn't run the model.
 * Assume the output uses all of params.max_tokens. If (input * input price + max_tokens * output price) / 1,000,000
 * is over limitUsd(), throw a BudgetError. Otherwise return { inputTokens, estimateUsd }.
 */
export async function guardBudget(claude, params) {
  return { inputTokens: 0, estimateUsd: 0 };
}
