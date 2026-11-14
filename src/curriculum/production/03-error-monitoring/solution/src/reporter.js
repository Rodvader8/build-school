import { scrub, scrubString, scrubUrl } from './scrub.js';
import { fingerprint } from './fingerprint.js';

/** Posts an event. sendBeacon survives the page closing; fetch is the fallback (and what Node uses). */
function defaultSend(endpoint, event) {
  const body = JSON.stringify(event);
  if (typeof navigator !== 'undefined' && navigator.sendBeacon?.(endpoint, body)) return;
  fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
}

const toError = (value) => (value instanceof Error ? value : new Error(String(value?.message ?? value)));

/**
 * The part that decides what gets reported. report(error, context) returns 'sent', 'duplicate' or 'sampled-out'.
 * send, random and now are injectable so the behaviour can be tested without a network or a clock.
 */
export function createReporter({ endpoint, release, sampleRate = 1, dedupeWindowMs = 60_000, send = defaultSend, random = Math.random, now = Date.now }) {
  const seen = new Map(); // fingerprint -> when it was last sent

  return {
    report(value, context = {}) {
      const error = toError(value);
      const print = fingerprint(error);

      const last = seen.get(print);
      if (last !== undefined && now() - last < dedupeWindowMs) return 'duplicate';
      if (random() >= sampleRate) return 'sampled-out';
      seen.set(print, now());

      const { url, type = 'error', ...rest } = context;
      send(endpoint, {
        type,
        name: error.name,
        message: scrubString(error.message),
        stack: scrubString(error.stack ?? ''),
        fingerprint: print,
        release,
        time: new Date(now()).toISOString(),
        url: url ? scrubUrl(url) : undefined,
        context: scrub(rest),
      });
      return 'sent';
    },
  };
}

/** Listens for the two things the browser reports on its own. Returns a function that removes the listeners. */
export function installBrowserReporter(win, reporter) {
  const onError = (event) => {
    if (!event.error && !event.message) return; // a failed image or script, not a code error
    reporter.report(event.error ?? new Error(event.message), { type: 'error', url: win.location?.href });
  };
  const onRejection = (event) => reporter.report(event.reason, { type: 'unhandledrejection', url: win.location?.href });
  win.addEventListener('error', onError);
  win.addEventListener('unhandledrejection', onRejection);
  return () => {
    win.removeEventListener('error', onError);
    win.removeEventListener('unhandledrejection', onRejection);
  };
}
