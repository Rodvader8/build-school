import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Edge functions and Blobs',
  minutes: 35,
  kind: 'node',
  entry: 'netlify/edge-functions/crawler-log.mjs',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'detectCrawler recognises the six AI crawlers, in any letter case', test: ({ output }) => passed(output, 'detectCrawler recognises the AI crawlers') },
    { label: 'It returns null for browsers, empty and missing user agents', test: ({ output }) => passed(output, 'detectCrawler ignores everyone else') },
    { label: 'logHit counts per day and per crawler under a date/name key', test: ({ output }) => passed(output, 'logHit counts per day and per crawler') },
    { label: 'logHit keeps the path but never the IP address or query string', test: ({ output }) => passed(output, 'logHit keeps no personal data') },
    { label: 'The handler logs a crawler visit and passes the page through untouched', test: ({ output }) => passed(output, 'the handler logs a crawler visit') },
    { label: 'The handler leaves normal visitors alone', test: ({ output }) => passed(output, 'the handler leaves normal visitors alone') },
    { label: 'A broken store never breaks the page', test: ({ output }) => passed(output, 'a broken store never breaks the page') },
    { label: 'The edge function runs on every path except static assets', test: ({ output }) => passed(output, 'config covers every path except assets') },
  ],
  hints: [
    'lower-case both the user agent and each crawler name, then use includes(). Return the name from AI_CRAWLERS so the log always uses one spelling.',
    'store.get(key, { type: "json" }) returns the saved object or null. Add one to its count and save it back with store.setJSON(key, value).',
    'Wrap the logging in try/catch inside the promise you give to context.waitUntil, then return context.next(). A logging problem must never be the visitor\'s problem.',
  ],
} satisfies LessonMeta;
