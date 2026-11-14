import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Rate limits and retries',
  minutes: 30,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'A 429 waits for Retry-After, then succeeds', test: ({ output }) => passed(output, 'a 429 waits for Retry-After, then succeeds') },
    { label: 'A 503 backs off 0.5 seconds, then 1.0', test: ({ output }) => passed(output, 'a 503 backs off 0.5 then 1.0 seconds') },
    { label: 'It gives up after max_tries with a clear error', test: ({ output }) => passed(output, 'it gives up after max_tries with a clear error') },
    { label: 'It doesn\'t sleep after the last try', test: ({ output }) => passed(output, 'it doesn\'t sleep after the last try') },
    { label: 'A 404 isn\'t retried', test: ({ output }) => passed(output, 'a 404 is not retried') },
    { label: 'create_charge survives a lost reply', test: ({ output }) => passed(output, 'create_charge survives a lost reply') },
    { label: 'It retried with the same Idempotency-Key', test: ({ output }) => passed(output, 'it retried with the same Idempotency-Key') },
    { label: 'So only one charge was made', test: ({ output }) => passed(output, 'so only one charge was made') },
  ],
  hints: [
    'Loop with for attempt in range(max_tries). On a retryable status, sleep and continue. On any other status, raise_for_status() and return.',
    'The wait is base_delay * 2**attempt, so attempt 0 gives 0.5, attempt 1 gives 1.0, attempt 2 gives 2.0.',
    'Make the key once, above the call to request_with_retries. If you make it inside the loop, every retry looks like a brand new charge.',
  ],
} satisfies LessonMeta;
