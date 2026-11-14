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
 * Worst-case cost of a request, worked out BEFORE sending it. The input is counted exactly with the token-counting
 * endpoint (it's free and doesn't run the model), and the output is assumed to use all of max_tokens. Cache discounts
 * are ignored on purpose: a guard should assume the worst.
 */
export async function guardBudget(claude, params) {
  const { input_tokens } = await claude.messages.countTokens({ model: params.model, system: params.system, messages: params.messages });
  const price = PRICES[params.model];
  const estimateUsd = (input_tokens * price.input + params.max_tokens * price.output) / 1_000_000;
  if (estimateUsd > limitUsd()) throw new BudgetError(estimateUsd, limitUsd());
  return { inputTokens: input_tokens, estimateUsd };
}
