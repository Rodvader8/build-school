import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Structured output you can trust',
  minutes: 50,
  kind: 'project',
  entry: 'lib/plan.js',
  checkEntry: 'check.mjs',
  devPort: 4862,
  devCommand: 'npm run dev -- --port 4862 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the schema accepts a good plan',
    'the schema rejects guests, times and costs that make no sense',
    'asks the API for JSON that matches the schema',
    'returns a checked plan on a good reply',
    'a refusal is reported as refused, not read as a plan',
    'a reply cut off by max_tokens is reported as truncated',
    'text that is not JSON is reported as malformed',
    'JSON with the wrong shape is reported as invalid and names the fields',
    'a good brief returns 200 and the plan',
    'each kind of failure gets a status and a plain message',
    'an empty brief returns 400 without calling Claude',
    'the site builds',
    'the build includes the /api/plan route',
    'the API key is read from the environment, never typed in the code',
    '.env.example documents the key with a fake value, and .env is ignored',
    'the key can never reach the browser',
  ]),
  hints: [
    'Zod gives you the exact rules: z.number().int().min(1) for guests, z.string().regex(/^\\d{2}:\\d{2}$/) for a time, z.array(z.object({ ... })).min(1) for a non-empty list.',
    'Check message.stop_reason before you read message.content. "refusal" and "max_tokens" both mean the content can\'t be trusted, so throw a PlanError for each and stop.',
    'Wrap JSON.parse in try/catch for "malformed". Then const result = PlanSchema.safeParse(data); when result.success is false, build issues with result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).',
  ],
} satisfies LessonMeta;
