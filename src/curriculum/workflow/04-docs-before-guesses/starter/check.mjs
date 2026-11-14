// check.mjs: Check my work runs this file. Read it, but don't change it.
import { readFileSync, readdirSync } from 'node:fs';

process.env.NUDGE_FAKE_TIME = '1'; // nudge skips real waiting; see vendor/nudge/docs/testing.md
const { stats } = await import('./vendor/nudge/index.js');
const { loadReport } = await import('./fetch-report.js');

async function check(name, test) {
  let ok = false;
  try {
    ok = !!(await test());
  } catch (error) {
    console.log(`  (${name} raised ${error.message})`);
  }
  console.log((ok ? 'PASS ' : 'FAIL ') + name);
}

const retryable = (message) => Object.assign(new Error(message), { retryable: true });
const fatal = (message) => Object.assign(new Error(message), { retryable: false });

/** A fake endpoint that fails `times` times with the given error, then returns a report. */
function flaky(times, makeError = retryable) {
  let calls = 0;
  return async () => {
    calls += 1;
    if (calls <= times) throw makeError(`failure ${calls}`);
    return { rows: 3 };
  };
}

const outcome = async (promise) => promise.then((value) => ({ value }), (error) => ({ error }));

await check('a flaky endpoint is retried until it works, in 4 attempts', async () => {
  const result = await loadReport(flaky(3));
  return result?.rows === 3 && stats.attempts === 4;
});
await check('it waits 2, 4 then 8 seconds, exactly', async () => {
  await loadReport(flaky(3));
  return JSON.stringify(stats.waits) === '[2,4,8]';
});
await check('it gives up after 4 attempts and throws the last error', async () => {
  const { error } = await outcome(loadReport(flaky(10)));
  return error?.message === 'failure 4' && stats.attempts === 4;
});
await check('an error that is not retryable is thrown at once, with no retries', async () => {
  const { error } = await outcome(loadReport(flaky(10, fatal)));
  return error?.message === 'failure 1' && stats.attempts === 1 && stats.waits.length === 0;
});
await check('an error with no retryable flag is not retried', async () => {
  const { error } = await outcome(loadReport(flaky(10, (message) => new Error(message))));
  return stats.attempts === 1 && !!error;
});
await check('a first-try success makes one call and no waits', async () => {
  const result = await loadReport(flaky(0));
  return result?.rows === 3 && stats.attempts === 1 && stats.waits.length === 0;
});

const pages = readdirSync('vendor/nudge/docs').filter((name) => name.endsWith('.md'));
const trail = readFileSync('DOCS_TRAIL.md', 'utf8');
const answers = trail.split('\n').filter((line) => /^\d\.\s+\S.*:\s*\S/.test(line));
await check('DOCS_TRAIL.md names a docs page for all four requirements', () => answers.length === 4 && answers.every((line) => pages.some((page) => line.includes(page))));
