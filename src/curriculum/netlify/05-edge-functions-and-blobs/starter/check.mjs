// Check my work: runs your project and inspects what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
/** Source code without comments, so a comment can't fool a check. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');



import { pathToFileURL } from 'node:url';

const FILE = 'netlify/edge-functions/crawler-log.mjs';
let m = null;
let loadError = '';
try {
  m = await import(pathToFileURL(path.resolve(FILE)).href);
} catch (e) {
  loadError = e.message;
}
// Run the checks one after another so the output order is stable.
const queue = [];
const test = (name, fn, why) => queue.push(async () => {
  if (!m) return fail(name, `The file didn't load: ${loadError}`);
  try {
    check(name, (await fn()) === true, why);
  } catch (e) {
    fail(name, e.message);
  }
});

/** A pretend Blobs store made from a Map. */
const fakeStore = (opts = {}) => {
  const data = new Map();
  return {
    data,
    async get(key) { if (opts.broken) throw new Error('store down'); return data.has(key) ? JSON.parse(data.get(key)) : null; },
    async setJSON(key, value) { if (opts.broken) throw new Error('store down'); data.set(key, JSON.stringify(value)); },
  };
};
const req = (url, ua, extra = {}) => new Request(url, { headers: { ...(ua ? { 'user-agent': ua } : {}), ...extra } });
const day1 = new Date('2026-11-14T03:00:00Z');
const day2 = new Date('2026-11-15T03:00:00Z');

test('detectCrawler recognises the AI crawlers', () =>
  [
    ['Mozilla/5.0 AppleWebKit/537.36; compatible; GPTBot/1.2; +https://openai.com/gptbot', 'GPTBot'],
    ['Mozilla/5.0 (compatible; OAI-SearchBot/1.0)', 'OAI-SearchBot'],
    ['Mozilla/5.0 AppleWebKit/537.36 (compatible; ChatGPT-User/1.0)', 'ChatGPT-User'],
    ['Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', 'ClaudeBot'],
    ['Mozilla/5.0 (compatible; PerplexityBot/1.0)', 'PerplexityBot'],
    ['CCBot/2.0 (https://commoncrawl.org/faq/)', 'CCBot'],
    ['claudebot', 'ClaudeBot'],
    ['SOMETHING GPTBOT SOMETHING', 'GPTBot'],
  ].every(([ua, name]) => m.detectCrawler(ua) === name),
'Each of the six names should be found anywhere in the user agent, whatever its letter case, and return the spelling from AI_CRAWLERS.');

test('detectCrawler ignores everyone else', () =>
  ['Mozilla/5.0 (Windows NT 10.0) Chrome/126.0 Safari/537.36', 'Googlebot/2.1 (+http://www.google.com/bot.html)', '', undefined, null].every((ua) => m.detectCrawler(ua) === null),
'Browsers, Googlebot, an empty string, undefined and null should all give null (not undefined, not an error).');

test('logHit counts per day and per crawler', async () => {
  const s = fakeStore();
  const r = req('https://example.com/pricing', 'GPTBot/1.0');
  await m.logHit(s, 'GPTBot', r, day1);
  await m.logHit(s, 'GPTBot', r, day1);
  await m.logHit(s, 'ClaudeBot', r, day1);
  await m.logHit(s, 'GPTBot', r, day2);
  const get = (k) => JSON.parse(s.data.get(k) ?? 'null');
  return get('2026-11-14/GPTBot')?.count === 2 && get('2026-11-14/ClaudeBot')?.count === 1 && get('2026-11-15/GPTBot')?.count === 1 && get('2026-11-14/GPTBot')?.lastSeen === day1.toISOString() && s.data.size === 3;
}, 'Two GPTBot visits on the 14th should make count 2 under "2026-11-14/GPTBot". ClaudeBot and the 15th get their own keys. Save lastSeen as an ISO date string.');

test('logHit keeps no personal data', async () => {
  const s = fakeStore();
  await m.logHit(s, 'CCBot', req('https://example.com/pricing?email=sam@example.com&ref=abc', 'CCBot/2.0', { 'x-forwarded-for': '203.0.113.9', 'x-nf-client-connection-ip': '203.0.113.9' }), day1);
  const saved = [...s.data.values()].join(' ');
  return JSON.parse(s.data.get('2026-11-14/CCBot') ?? '{}').lastPath === '/pricing' && !saved.includes('203.0.113') && !saved.includes('sam@') && !saved.includes('ref=');
}, 'Save lastPath as the pathname only (/pricing), and never copy headers, an IP address or the query string into the store.');

test('the handler logs a crawler visit', async () => {
  const s = fakeStore();
  const pending = [];
  const context = { next: async () => new Response('the page', { status: 200, headers: { 'x-origin': 'yes' } }), waitUntil: (p) => pending.push(p) };
  const res = await m.makeHandler(async () => s)(req('https://example.com/about', 'Mozilla/5.0 (compatible; ClaudeBot/1.0)'), context);
  await Promise.all(pending);
  const today = [...s.data.keys()];
  return (await res.text()) === 'the page' && res.headers.get('x-origin') === 'yes' && pending.length === 1 && today.length === 1 && today[0].endsWith('/ClaudeBot');
}, 'For a crawler, call context.waitUntil(...) with the logging promise exactly once, then return what context.next() gave you, unchanged.');

test('the handler leaves normal visitors alone', async () => {
  let opened = 0;
  const pending = [];
  const context = { next: async () => new Response('the page'), waitUntil: (p) => pending.push(p) };
  const res = await m.makeHandler(async () => { opened++; return fakeStore(); })(req('https://example.com/', 'Mozilla/5.0 Chrome/126.0 Safari/537.36'), context);
  return (await res.text()) === 'the page' && pending.length === 0 && opened === 0;
}, 'For a normal browser, don\'t open the store and don\'t call waitUntil. Just return context.next().');

test('a broken store never breaks the page', async () => {
  const pending = [];
  const context = { next: async () => new Response('the page'), waitUntil: (p) => pending.push(p) };
  const real = console.error;
  console.error = () => {};
  try {
    const res = await m.makeHandler(async () => fakeStore({ broken: true }))(req('https://example.com/', 'GPTBot/1.0'), context);
    await Promise.all(pending); // a rejected promise here means the error escaped
    return (await res.text()) === 'the page';
  } finally {
    console.error = real;
  }
}, 'Wrap the logging in try/catch inside the promise you pass to waitUntil, so a failing store changes nothing for the visitor.');

test('config covers every path except assets', () => {
  const c = m.config;
  const ex = [].concat(c?.excludedPath ?? []);
  return c?.path === '/*' && ex.length >= 2 && ex.every((p) => typeof p === 'string' && p.startsWith('/')) && typeof m.default === 'function';
}, "Export config = { path: '/*', excludedPath: ['/*.css', '/*.js', ...] }. Every path must start with /.");

for (const run of queue) await run();
