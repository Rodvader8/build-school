// Check my work: tests your scrubber, reporter and server handler, then proves it end to end with a real browser
// and a local collector. Nothing leaves this machine. Every check prints PASS or FAIL.
import { createServer } from 'node:http';
import { EventEmitter } from 'node:events';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startCollector } from './collector.mjs';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const load = (file) => import(pathToFileURL(path.resolve(file)).href);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 4000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return true;
    await wait(40);
  }
  return fn();
}
// Fake values only. These are built from pieces so they're obviously not real credentials.
const FAKE_KEY = ['sk', 'test', 'FAKEFAKEFAKE1234567890'].join('-');
const FAKE_AWS = 'AKIA' + 'FAKEFAKEFAKE1234';
const FAKE_JWT = ['eyJhbGciOiJIUzI1NiJ9', 'eyJ1c2VyIjoiZmFrZSJ9', 'ZmFrZXNpZ25hdHVyZQ'].join('.');

let scrubMod = null;
let reporterMod = null;
let serverMod = null;
const errors = {};
for (const [key, file] of [['scrub', 'src/scrub.js'], ['reporter', 'src/reporter.js'], ['server', 'src/server.js']]) {
  try {
    const m = await load(file);
    if (key === 'scrub') scrubMod = m;
    if (key === 'reporter') reporterMod = m;
    if (key === 'server') serverMod = m;
  } catch (e) {
    errors[key] = e.message.split('\n')[0];
  }
}
const T = (name, mod, key, fn, why) => {
  try {
    check(name, !!mod && fn(mod) === true, mod ? why : `${key} didn't load: ${errors[key]}`);
  } catch (e) {
    check(name, false, e.message.split('\n')[0]);
  }
};
const TA = async (name, mod, key, fn, why) => {
  try {
    check(name, !!mod && (await fn(mod)) === true, mod ? why : `${key} didn't load: ${errors[key]}`);
  } catch (e) {
    check(name, false, e.message.split('\n')[0]);
  }
};

/* ---- scrubbing ---- */
T('scrub hides email addresses and phone numbers', scrubMod, 'scrub.js', ({ scrubString: s }) => {
  const a = s('Failed for sam@example.com on submit');
  const b = s('Call +61 412 345 678 or 0412 345 678');
  return !a.includes('sam@example.com') && a.includes('[email]') && !/412 ?345/.test(b) && (b.match(/\[phone\]/g) ?? []).length === 2 && s('Order 4411 failed at 2026-11-14') === 'Order 4411 failed at 2026-11-14';
}, 'Replace emails with [email] and phone numbers with [phone]. Leave ordinary numbers and dates alone.');

T('scrub hides API keys, bearer tokens, JWTs and password=... values', scrubMod, 'scrub.js', ({ scrubString: s }) => {
  const text = s(`key ${FAKE_KEY} aws ${FAKE_AWS} Authorization: Bearer abcdefghij1234567890 jwt ${FAKE_JWT} url ?token=abc123 and password=hunter2hunter2`);
  return ![FAKE_KEY, FAKE_AWS, FAKE_JWT, 'abcdefghij1234567890', 'abc123', 'hunter2'].some((secret) => text.includes(secret)) && text.includes('[secret]') && text.includes('token=[redacted]') && text.includes('password=[redacted]');
}, 'Known key shapes become [secret]. Anything like token=..., password=... or api_key=... keeps its name and becomes name=[redacted].');

T('scrubUrl hides sensitive query values and drops the fragment', scrubMod, 'scrub.js', ({ scrubUrl: u }) => {
  const a = u('https://shop.example/cart?id=7&token=abc123xyz&session=s3cr3t#access_token=zzz');
  const b = u('/reset?key=abc123&page=2');
  return a.includes('id=7') && !a.includes('abc123xyz') && !a.includes('s3cr3t') && !a.includes('#') && !a.includes('zzz') && /token=(\[redacted\]|%5Bredacted%5D)/.test(a) && b.startsWith('/reset?') && b.includes('page=2') && !b.includes('abc123');
}, 'Keep harmless parameters (id=7), replace the values of token, key, session, password and friends, and drop the #fragment. A relative URL stays relative.');

T('scrub masks sensitive keys, deeply, without changing the original', scrubMod, 'scrub.js', ({ scrub: s }) => {
  const input = { user: { email: 'ana@example.com', password: 'hunter2' }, headers: { authorization: 'Bearer abcdefghij1234567890', cookie: 'sid=1', accept: 'text/html' }, list: ['call 0412 345 678'], n: 3 };
  const copy = JSON.stringify(input);
  const result = s(input);
  const circular = {};
  circular.self = circular;
  return JSON.stringify(input) === copy && result.user.password === '[redacted]' && result.user.email === '[email]' && result.headers.authorization === '[redacted]' && result.headers.cookie === '[redacted]' && result.headers.accept === 'text/html' && result.list[0].includes('[phone]') && result.n === 3 && typeof JSON.stringify(s(circular)) === 'string';
}, 'Mask the VALUE of keys named password, token, secret, apiKey, authorization, cookie or session. Clean every string inside arrays and objects, and stop at a depth limit so a circular object can\'t hang you.');

/* ---- the reporter, with a fake network and a fake clock ---- */
const make = (mod, options = {}) => {
  const sent = [];
  let t = 1_700_000_000_000;
  const reporter = mod.createReporter({ endpoint: 'http://collector.invalid/ingest', release: '1.4.2', send: (url, event) => sent.push({ url, event }), now: () => t, ...options });
  return { reporter, sent, tick: (ms) => (t += ms) };
};

T('the reporter sends message, stack, type, release, time and a fingerprint', reporterMod, 'reporter.js', (m) => {
  const { reporter, sent } = make(m);
  const status = reporter.report(new TypeError('Cannot read x'), { type: 'error', url: 'https://shop.example/cart' });
  const e = sent[0]?.event ?? {};
  return status === 'sent' && sent.length === 1 && sent[0].url === 'http://collector.invalid/ingest' && e.message === 'Cannot read x' && e.name === 'TypeError' && typeof e.stack === 'string' && e.type === 'error' && e.release === '1.4.2' && /^\d{4}-\d\d-\d\dT/.test(e.time) && /^[0-9a-f]{8}$/.test(e.fingerprint) && e.url === 'https://shop.example/cart';
}, 'report() should send { type, name, message, stack, fingerprint, release, time, url, context } and return "sent". Use fingerprint() from fingerprint.js.');

T('the reporter scrubs the event before it leaves', reporterMod, 'reporter.js', (m) => {
  const { reporter, sent } = make(m);
  reporter.report(new Error(`Charge failed for ana@example.com with ${FAKE_KEY}`), { url: '/pay?token=abc123xyz', user: { email: 'ana@example.com' }, password: 'hunter2' });
  const text = JSON.stringify(sent[0]?.event ?? {});
  return sent.length === 1 && !/ana@example\.com|FAKEFAKE|abc123xyz|hunter2/.test(text);
}, 'Scrub the message, the stack and the url, and run the rest of the context through scrub(). Nothing personal or secret should survive in the event.');

T('the same error is sent once inside the dedupe window, and again after it', reporterMod, 'reporter.js', (m) => {
  const { reporter, sent, tick } = make(m, { dedupeWindowMs: 60_000 });
  const first = reporter.report(new Error('Order 4411 failed'));
  const dup = reporter.report(new Error('Order 9023 failed')); // same fingerprint: only the number differs
  const other = reporter.report(new Error('Something else'));
  tick(61_000);
  const again = reporter.report(new Error('Order 5 failed'));
  return first === 'sent' && dup === 'duplicate' && other === 'sent' && again === 'sent' && sent.length === 3;
}, 'Remember when each fingerprint was last sent. Inside the window, return "duplicate" and send nothing. fingerprint() already treats "Order 4411" and "Order 9023" as the same bug.');

T('sampling keeps the configured share of distinct errors', reporterMod, 'reporter.js', (m) => {
  const rolls = [0.1, 0.9, 0.4, 0.6];
  const a = make(m, { sampleRate: 0.5, random: () => rolls.shift() });
  const results = ['a', 'b', 'c', 'd'].map((x) => a.reporter.report(new Error(`failure ${x}`)));
  const none = make(m, { sampleRate: 0, random: () => 0 });
  none.reporter.report(new Error('x'));
  const all = make(m, { sampleRate: 1, random: () => 0.999 });
  all.reporter.report(new Error('y'));
  return results.join() === 'sent,sampled-out,sent,sampled-out' && a.sent.length === 2 && none.sent.length === 0 && all.sent.length === 1;
}, 'Send only when random() < sampleRate, otherwise return "sampled-out". A sampled-out error must not be remembered as sent.');

T('the browser reporter catches errors and unhandled rejections', reporterMod, 'reporter.js', (m) => {
  const win = new EventTarget();
  win.location = { href: 'https://shop.example/checkout?token=abc123xyz' };
  const { reporter, sent } = make(m);
  const off = m.installBrowserReporter(win, reporter);
  win.dispatchEvent(Object.assign(new Event('error'), { error: new Error('boom'), message: 'boom' }));
  win.dispatchEvent(Object.assign(new Event('error'), {})); // a failed image: nothing to report
  win.dispatchEvent(Object.assign(new Event('unhandledrejection'), { reason: new Error('nope') }));
  const count = sent.length;
  off();
  win.dispatchEvent(Object.assign(new Event('error'), { error: new Error('after off'), message: 'after off' }));
  return count === 2 && sent.length === 2 && sent[0].event.type === 'error' && sent[1].event.type === 'unhandledrejection' && !sent[0].event.url.includes('abc123xyz');
}, 'Add listeners for "error" and "unhandledrejection". Ignore error events with no error and no message. Return a function that removes both listeners.');

/* ---- the server side ---- */
await TA('the server handler reports the error and answers 500 without leaking the stack', serverMod, 'server.js', async (m) => {
  const { reporter, sent } = make(reporterMod ?? { createReporter: () => ({ report() {} }) });
  const res = { headersSent: false, statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(b = '') { this.body += b; } };
  await m.wrapHandler(async () => { throw new Error('db password=hunter2hunter2 failed for ana@example.com'); }, { reporter })({ url: '/orders?token=abc123xyz', method: 'GET', headers: { authorization: 'Bearer abcdefghij1234567890', accept: 'json' } }, res);
  const body = JSON.parse(res.body || '{}');
  const text = JSON.stringify(sent[0]?.event ?? {});
  const ok = await (async () => { const r2 = { ...res, body: '' }; await m.wrapHandler(async (q, s) => s.end('fine'), { reporter })({}, r2); return r2.body === 'fine'; })();
  return res.statusCode === 500 && body.error === 'Something went wrong' && !res.body.includes('hunter2') && !res.body.includes('Error:') && sent.length === 1 && sent[0].event.type === 'server' && !/hunter2|ana@example|abc123xyz|abcdefghij1234567890/.test(text) && ok;
}, 'Catch the error, report it with { type: "server", url, method, headers }, and answer 500 with a generic message. A handler that works must be left alone.');

T('process-level handlers report uncaught exceptions and unhandled rejections', serverMod, 'server.js', (m) => {
  const proc = new EventEmitter();
  const { reporter, sent } = make(reporterMod);
  m.installProcessHandlers(proc, reporter);
  proc.emit('uncaughtException', new Error('crash one'));
  proc.emit('unhandledRejection', new Error('crash two'));
  return sent.map((s) => s.event.type).join() === 'uncaughtException,unhandledRejection';
}, 'Register both events on proc and report each with its own context type.');

/* ---- end to end: a real browser and a real collector ---- */
if (reporterMod && scrubMod && existsSync('node_modules/playwright')) {
  const collector = await startCollector();
  const files = createServer((req, res) => {
    const file = path.join(process.cwd(), decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(process.cwd()) || !existsSync(file) || file === process.cwd()) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': file.endsWith('.html') ? 'text/html' : 'text/javascript' }).end(readFileSync(file));
  });
  await new Promise((r) => files.listen(0, '127.0.0.1', r));
  let browser;
  let note = '';
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('pageerror', () => {}); // the errors are the point
    await page.goto(`http://127.0.0.1:${files.address().port}/demo/index.html?endpoint=${encodeURIComponent(collector.url)}`);
    await page.waitForFunction(() => window.__ready, null, { timeout: 5000 });
    for (let i = 0; i < 4; i++) await page.evaluate(() => window.__fire()); // the same two bugs, four times each
    await until(() => collector.events.length >= 2);
    await wait(400);
  } catch (e) {
    note = e.message.split('\n')[0];
  } finally {
    await browser?.close();
  }
  const events = collector.events;
  const text = JSON.stringify(events);
  check(
    'a real browser error reaches the collector, scrubbed, and a repeat is sent only once',
    !note && events.length === 2 && events.map((e) => e.type).sort().join() === 'error,unhandledrejection' && events.every((e) => e.release === 'demo-1.0.0') && !/sam@example\.com|abc123secretvalue/.test(text),
    note || `The collector got ${events.length} event(s): ${events.map((e) => e.type).join(', ') || 'none'}. Expected one error and one unhandledrejection, with nothing personal in either.`,
  );

  // A server crash, end to end, with the default send (fetch) going to the collector.
  if (serverMod) {
    const before = collector.events.length;
    const reporter = reporterMod.createReporter({ endpoint: collector.url, release: 'api-2.0.0' });
    const wrapped = serverMod.wrapHandler(async () => { throw new Error(`Stripe rejected ${FAKE_KEY} for ana@example.com`); }, { reporter });
    const app = createServer((req, res) => wrapped(req, res).catch(() => res.writeHead(500).end())); // an unfinished wrapHandler must fail a check, not crash it
    await new Promise((r) => app.listen(0, '127.0.0.1', r));
    const res = await fetch(`http://127.0.0.1:${app.address().port}/pay?token=abc123xyz`);
    await until(() => collector.events.length > before);
    app.close();
    const got = JSON.stringify(collector.events.slice(before));
    check('a secret in a server error never reaches the collector', res.status === 500 && collector.events.length === before + 1 && !/FAKEFAKE|ana@example|abc123xyz/.test(got) && !(await res.text()).includes('Stripe'), `Status ${res.status}. The collector received: ${got.slice(0, 160)}`);
  } else check('a secret in a server error never reaches the collector', false, `server.js didn't load: ${errors.server}`);
  files.close();
  await collector.close();
} else {
  check('a real browser error reaches the collector, scrubbed, and a repeat is sent only once', false, existsSync('node_modules/playwright') ? 'scrub.js or reporter.js did not load.' : 'Run "npm install" in the terminal first.');
  check('a secret in a server error never reaches the collector', false, 'The reporter did not load.');
}
process.exit(0);
