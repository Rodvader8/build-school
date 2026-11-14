/**
 * A fixed-window rate limiter. Each key (an IP address, say) gets `limit` requests per `windowMs`.
 * check(key) says whether this request may go ahead and, if not, how long to wait.
 */
export function createLimiter({ limit, windowMs, now = Date.now }) {
  const windows = new Map(); // key -> { start, count }

  return {
    check(key) {
      const t = now();
      let entry = windows.get(key);
      if (!entry || t - entry.start >= windowMs) {
        // Forget windows that have run out, so the map can't grow for ever.
        for (const [k, w] of windows) if (t - w.start >= windowMs) windows.delete(k);
        entry = { start: t, count: 0 };
        windows.set(key, entry);
      }
      entry.count += 1;
      const allowed = entry.count <= limit;
      return { allowed, remaining: Math.max(0, limit - entry.count), retryAfterSeconds: allowed ? 0 : Math.ceil((entry.start + windowMs - t) / 1000) };
    },
  };
}
