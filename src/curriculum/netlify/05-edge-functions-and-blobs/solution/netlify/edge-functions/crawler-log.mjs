// An edge function that keeps a daily tally of AI crawler visits in Netlify Blobs.

export const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'CCBot'];

/** The crawler's name from AI_CRAWLERS if this user agent is one of them, otherwise null. */
export function detectCrawler(userAgent) {
  const ua = String(userAgent ?? '').toLowerCase();
  return AI_CRAWLERS.find((name) => ua.includes(name.toLowerCase())) ?? null;
}

/** Adds one to today's count for this crawler: key "YYYY-MM-DD/<crawler>", value { count, lastSeen, lastPath }. */
export async function logHit(store, crawler, request, now = new Date()) {
  const key = `${now.toISOString().slice(0, 10)}/${crawler}`;
  const previous = await store.get(key, { type: 'json' });
  await store.setJSON(key, {
    count: (previous?.count ?? 0) + 1,
    lastSeen: now.toISOString(),
    lastPath: new URL(request.url).pathname, // no query string, no IP address
  });
}

/** Builds the handler. openStore() returns the store, so tests can pass a fake one. */
export const makeHandler = (openStore) => async (request, context) => {
  const crawler = detectCrawler(request.headers.get('user-agent'));
  if (crawler) {
    context.waitUntil(
      (async () => {
        try {
          await logHit(await openStore(), crawler, request);
        } catch {
          console.error('Crawler log failed'); // the visitor never sees this
        }
      })(),
    );
  }
  return context.next();
};

// The real wiring: open the real Blobs store, only when it's needed.
export default makeHandler(async () => (await import('@netlify/blobs')).getStore('crawler-log'));

export const config = { path: '/*', excludedPath: ['/*.css', '/*.js', '/*.png', '/*.jpg', '/*.svg', '/*.woff2'] };
