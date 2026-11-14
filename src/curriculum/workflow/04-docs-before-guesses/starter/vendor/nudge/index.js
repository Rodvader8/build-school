// nudge: retry an async function, waiting longer between each try.
// Every duration in nudge is in SECONDS. See docs/options.md.

const DEFAULTS = {
  attempts: 1,
  delay: 1,
  factor: 2,
  maxDelay: 30,
  jitter: 0.2,
  retryIf: () => true,
};

/** What the most recent call to retry() did. Handy in tests: see docs/testing.md. */
export const stats = { attempts: 0, waits: [] };

const sleep = (seconds) =>
  process.env.NUDGE_FAKE_TIME ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export async function retry(fn, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  stats.attempts = 0;
  stats.waits = [];
  let wait = settings.delay;
  for (;;) {
    stats.attempts += 1;
    try {
      return await fn(stats.attempts);
    } catch (error) {
      if (stats.attempts >= settings.attempts || !settings.retryIf(error)) throw error;
      const seconds = settings.jitter ? wait * (1 + (Math.random() * 2 - 1) * settings.jitter) : wait;
      stats.waits.push(seconds);
      await sleep(seconds);
      wait = Math.min(wait * settings.factor, settings.maxDelay);
    }
  }
}
