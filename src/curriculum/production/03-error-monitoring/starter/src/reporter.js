import { scrub, scrubString, scrubUrl } from './scrub.js';
import { fingerprint } from './fingerprint.js';

/** Posts an event. sendBeacon survives the page closing; fetch is the fallback (and what Node uses). */
function defaultSend(endpoint, event) {
  const body = JSON.stringify(event);
  if (typeof navigator !== 'undefined' && navigator.sendBeacon?.(endpoint, body)) return;
  fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
}

/**
 * The part that decides what gets reported. report(error, context) returns 'sent', 'duplicate' or 'sampled-out'.
 *
 * - Anything thrown can be a string or an object, so turn it into an Error first.
 * - Duplicates: the same fingerprint inside dedupeWindowMs is 'duplicate' and isn't sent.
 * - Sampling: send only when random() < sampleRate. Otherwise 'sampled-out', and don't remember it.
 * - The event sent: { type, name, message, stack, fingerprint, release, time (ISO string), url, context },
 *   with message, stack and url scrubbed and the rest of the context run through scrub().
 *   context.type names the kind ('error', 'unhandledrejection', 'server'); context.url is the page or request.
 * send, random and now are injectable so this can be tested without a network or a clock.
 */
export function createReporter({ endpoint, release, sampleRate = 1, dedupeWindowMs = 60_000, send = defaultSend, random = Math.random, now = Date.now }) {
  return {
    report(value, context = {}) {
      // TODO
      return 'sent';
    },
  };
}

/** Listens for window 'error' and 'unhandledrejection' events and reports them (context type 'error' or
 *  'unhandledrejection', url from win.location?.href). Ignore 'error' events with no error and no message
 *  (a failed image). Returns a function that removes both listeners. */
export function installBrowserReporter(win, reporter) {
  // TODO
  return () => {};
}
