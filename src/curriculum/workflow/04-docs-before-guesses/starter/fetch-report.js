import { retry } from './vendor/nudge/index.js';

// The report endpoint is flaky. Wrap it so it behaves the way TASKS.md describes.
// (This is a first guess from memory. Is it right? Check the docs.)
export function loadReport(fetchReport) {
  return retry(fetchReport, {
    tries: 4,
    delay: 2000,
    backoff: 2,
    shouldRetry: (error) => error.retryable,
  });
}
