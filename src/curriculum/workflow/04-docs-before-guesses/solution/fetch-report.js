import { retry } from './vendor/nudge/index.js';

// The report endpoint is flaky. Wrap it so it behaves the way TASKS.md describes.
// Option names, units and defaults are all from vendor/nudge/docs/options.md and errors.md.
export function loadReport(fetchReport) {
  return retry(fetchReport, {
    attempts: 4,
    delay: 2,
    factor: 2,
    jitter: 0,
    retryIf: (error) => error.retryable === true,
  });
}
