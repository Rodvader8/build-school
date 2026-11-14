import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Costs, caching and a budget guard',
  minutes: 55,
  kind: 'project',
  entry: 'lib/triage.js',
  checkEntry: 'check.mjs',
  devPort: 4864,
  devCommand: 'npm run dev -- --port 4864 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'costOf prices input and output tokens per million',
    'cache reads cost a tenth of normal input and cache writes a quarter more',
    'a model with no price is an error, not a free call',
    'simple steps use the small model and planning uses the big one',
    'the classify call goes to the small model with a small token limit',
    'the handbook is marked for caching, comes first and holds nothing that changes',
    'the second enquiry reads the handbook from the cache',
    'the total is worked out from the real usage numbers',
    'counts the tokens first, then lets a cheap request through',
    'a request that could cost too much is refused before it is sent',
    'returns the category, the reply, and what it cost',
    'an over-budget request returns 422 with kind budget, and a bad body returns 400',
    'the site builds',
    'the build includes the /api/triage route',
    'the API key is read from the environment, never typed in the code',
    '.env.example documents the key with a fake value, and .env is ignored',
    'the key can never reach the browser',
  ]),
  hints: [
    'usage.input_tokens only counts tokens that weren\'t cached. Add cache_creation_input_tokens * 1.25 and cache_read_input_tokens * 0.1 (both times the input price), then output_tokens times the output price, and divide the lot by 1,000,000.',
    'To cache, system must be an array of blocks: [{ type: "text", text: VENUE_GUIDE, cache_control: { type: "ephemeral" } }]. Keep it first and keep anything that changes per request (the enquiry) out of it, because caching matches a prefix exactly.',
    'In guardBudget, call claude.messages.countTokens({ model, system, messages }), work out (input_tokens * price.input + max_tokens * price.output) / 1e6, and throw new BudgetError(estimate, limitUsd()) when it\'s over the limit.',
  ],
} satisfies LessonMeta;
