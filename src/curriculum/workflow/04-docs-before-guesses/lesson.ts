import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Docs before guesses',
  minutes: 30,
  kind: 'node',
  entry: 'fetch-report.js',
  checkEntry: 'check.mjs',
  checks: outputChecks([
    'a flaky endpoint is retried until it works, in 4 attempts',
    'it waits 2, 4 then 8 seconds, exactly',
    'it gives up after 4 attempts and throws the last error',
    'an error that is not retryable is thrown at once, with no retries',
    'an error with no retryable flag is not retried',
    'a first-try success makes one call and no waits',
    'DOCS_TRAIL.md names a docs page for all four requirements',
  ]),
  hints: [
    'Start with vendor/nudge/docs/README.md. It lists every page and the three mistakes people make most. Then read options.md in full: it\'s one table.',
    'Look for what the table says about units and about what a number means. "attempts: 4" can mean four tries or four retries, and the page says which.',
    'The first draft fails silently because nudge ignores option names it doesn\'t know. If a setting seems to do nothing, check its spelling against the table before you check anything else.',
  ],
} satisfies LessonMeta;
