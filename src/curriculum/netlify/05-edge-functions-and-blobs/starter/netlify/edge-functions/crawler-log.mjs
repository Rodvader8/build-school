// An edge function that keeps a daily tally of AI crawler visits in Netlify Blobs.

export const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'CCBot'];

/** The crawler's name from AI_CRAWLERS if this user agent is one of them, otherwise null. */
export function detectCrawler(userAgent) {
  // TODO
  return null;
}

/** Adds one to today's count for this crawler: key "YYYY-MM-DD/<crawler>", value { count, lastSeen, lastPath }. */
export async function logHit(store, crawler, request, now = new Date()) {
  // TODO
}

/** Builds the handler. openStore() returns the store, so tests can pass a fake one. */
export const makeHandler = (openStore) => async (request, context) => {
  // TODO: log crawler visits without waiting and without ever failing
  return context.next();
};

// The real wiring: open the real Blobs store, only when it's needed.
export default makeHandler(async () => (await import('@netlify/blobs')).getStore('crawler-log'));

// TODO: export const config = ...
