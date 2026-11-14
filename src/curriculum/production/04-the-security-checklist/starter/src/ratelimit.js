/**
 * A fixed-window rate limiter. Each key (an IP address, say) gets `limit` requests per `windowMs`.
 *
 * check(key) returns { allowed, remaining, retryAfterSeconds }:
 *  - the first request for a key opens a window that lasts windowMs
 *  - requests inside the window count; once count passes limit, allowed is false
 *  - retryAfterSeconds is how long until the window ends (rounded up), or 0 when allowed
 *  - once the window has ended, the key starts again from zero
 *  - keys are independent, and expired windows should be forgotten so the Map can't grow for ever
 * `now` is injectable so tests don't have to wait.
 */
export function createLimiter({ limit, windowMs, now = Date.now }) {
  return {
    check(key) {
      // TODO
      return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
    },
  };
}
