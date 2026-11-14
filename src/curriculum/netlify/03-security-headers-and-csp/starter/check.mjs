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


/* ---- a small TOML reader: tables, arrays of tables, strings, numbers, booleans, arrays, inline tables ---- */
function stripComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === '#') return line.slice(0, i);
  }
  return line;
}
function depthOf(s) {
  let d = 0;
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === '[' || c === '{') d++;
    else if (c === ']' || c === '}') d--;
  }
  return d;
}
function splitTop(s) {
  const parts = [];
  let depth = 0;
  let q = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '\\' && q === '"') i++;
      else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'") q = c;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') depth--;
    else if (c === ',' && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}
function tomlKey(k) {
  k = k.trim();
  return k.startsWith('"') ? JSON.parse(k) : k.startsWith("'") ? k.slice(1, -1) : k;
}
function tomlValue(v) {
  v = v.trim();
  if (v.startsWith('"""') || v.startsWith("'''")) throw new Error('Multi-line strings are not supported here. Use a normal "quoted" string.');
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith("'")) return v.slice(1, -1);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('[')) return splitTop(v.slice(1, -1)).map(tomlValue);
  if (v.startsWith('{')) return Object.fromEntries(splitTop(v.slice(1, -1)).map((kv) => { const i = kv.indexOf('='); return [tomlKey(kv.slice(0, i)), tomlValue(kv.slice(i + 1))]; }));
  if (/^[-+]?\d[\d_]*(\.\d+)?$/.test(v)) return Number(v.replace(/_/g, ''));
  throw new Error(`Can't read the value: ${v}`);
}
function parseToml(src) {
  const root = {};
  let cur = root;
  const lines = src.split('\n').map(stripComment);
  const walk = (parts, create) => {
    let node = root;
    for (const p of parts) {
      if (Array.isArray(node[p])) node = node[p][node[p].length - 1];
      else node = node[p] ??= create && {};
    }
    return node;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let m = /^\[\[\s*([^\]]+?)\s*\]\]$/.exec(line);
    if (m) {
      const parts = m[1].split('.').map(tomlKey);
      const parent = walk(parts.slice(0, -1), true);
      (parent[parts.at(-1)] ??= []).push((cur = {}));
      continue;
    }
    m = /^\[\s*([^\]]+?)\s*\]$/.exec(line);
    if (m) {
      cur = walk(m[1].split('.').map(tomlKey), true);
      continue;
    }
    const eq = line.indexOf('=');
    if (eq < 1) throw new Error(`Line ${i + 1}: expected key = value, found: ${line}`);
    let value = line.slice(eq + 1);
    while (depthOf(value) > 0 && i + 1 < lines.length) value += ' ' + lines[++i].trim();
    cur[tomlKey(line.slice(0, eq))] = tomlValue(value);
  }
  return root;
}
/** Reads and parses a TOML file, or returns { error } so a typo is a FAIL instead of a crash. */
function loadToml(file) {
  try {
    return { toml: parseToml(read(file)) };
  } catch (e) {
    return { toml: {}, error: e.message };
  }
}
// Works out which headers a path gets, the way Netlify reads a _headers file.
// Provided for you: the dev server and Check my work both use it. Read it, but you don't need to change it.

/** Turns the text of a _headers file into [{ for: "/*", values: { Header: "value" } }]. */
function parseHeadersFile(text) {
  const rules = [];
  let cur = null;
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (/^\s/.test(raw)) {
      const i = raw.indexOf(':');
      if (cur && i > 0) cur.values[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
    } else {
      cur = { for: raw.trim(), values: {} };
      rules.push(cur);
    }
  }
  return rules;
}

/** A pattern is an exact path, or ends in * to match everything below it. */
const pathMatches = (pattern, p) => pattern === p || (pattern.endsWith('*') && p.startsWith(pattern.slice(0, -1)));

/** Every header that applies to a path, with lower-case names. */
function headersFor(p, rules) {
  const h = {};
  for (const r of rules) {
    if (!pathMatches(r.for, p)) continue;
    for (const [k, v] of Object.entries(r.values)) h[k.toLowerCase()] = v;
  }
  return h;
}

import http from 'node:http';

if (!existsSync('node_modules/playwright')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { chromium } = await import('playwright');

/* ---- which headers does "/" get? (site/_headers, plus any [[headers]] in netlify.toml) ---- */
const tomlRules = (loadToml('netlify.toml').toml.headers ?? []).map((h) => ({ for: h.for, values: h.values ?? {} }));
const rules = [...parseHeadersFile(read('site/_headers')), ...tomlRules];
const headers = headersFor('/', rules);
const csp = headers['content-security-policy'] ?? '';
const directives = Object.fromEntries(
  csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => { const [name, ...src] = d.split(/\s+/); return [name.toLowerCase(), src]; }),
);

check('there is a Content-Security-Policy', csp.length > 0, 'Add a line "Content-Security-Policy: ..." under /* in site/_headers.');
check(
  'the CSP starts locked down',
  directives['default-src']?.includes("'self'") && directives['object-src']?.includes("'none'") && directives['base-uri']?.includes("'self'") && !!directives['form-action'] && !!directives['frame-ancestors'],
  "Needs default-src 'self', object-src 'none', base-uri 'self', form-action and frame-ancestors.",
);
const allSources = Object.values(directives).flat();
const scriptSources = directives['script-src'] ?? directives['default-src'] ?? [];
check(
  'no unsafe-inline, unsafe-eval or wildcards',
  csp.length > 0 && !scriptSources.some((s) => /unsafe-(inline|eval)/.test(s)) && !allSources.some((s) => s === '*' || s === 'https:' || s === 'http:' || s.includes('*')),
  "Remove 'unsafe-inline', 'unsafe-eval', *, https: and any *.host entries. Name each host in full.",
);
const hsts = parseInt(/max-age=(\d+)/.exec(headers['strict-transport-security'] ?? '')?.[1] ?? '0', 10);
const otherHeaders = [
  [headers['x-content-type-options']?.toLowerCase() === 'nosniff', 'X-Content-Type-Options: nosniff'],
  [/^(strict-origin-when-cross-origin|no-referrer|same-origin|strict-origin)$/.test(headers['referrer-policy'] ?? ''), 'Referrer-Policy: strict-origin-when-cross-origin'],
  [(headers['permissions-policy'] ?? '').length > 0, 'Permissions-Policy: camera=(), microphone=(), geolocation=()'],
  [hsts >= 31536000, 'Strict-Transport-Security: max-age=31536000; includeSubDomains'],
];
check('the other security headers are set', otherHeaders.every(([ok]) => ok), 'Missing or weak: ' + otherHeaders.filter(([ok]) => !ok).map(([, h]) => h).join(' | '));

/* ---- serve the page with those headers, answer the third-party hosts with stand-ins, and watch for violations ---- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const file = path.join('site', p === '/' ? 'index.html' : p.slice(1));
  if (p.includes('..') || p === '/_headers' || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'text/plain', ...headersFor(p, rules) });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const stubs = {
  'www.googletagmanager.com': ['text/javascript', 'window.__gtagLoaded = true;'],
  'images.example-cdn.com': ['image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#3a7"/></svg>'],
  'www.youtube-nocookie.com': ['text/html', '<p>video</p>'],
  'www.google-analytics.com': ['text/plain', ''],
  'evil.example': ['text/javascript', 'window.__evilRan = true;'],
};
const expectedHosts = ['www.googletagmanager.com', 'images.example-cdn.com', 'www.youtube-nocookie.com', 'www.google-analytics.com'];

const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => {
    const [type, body] = stubs[new URL(route.request().url()).hostname] ?? ['text/plain', ''];
    route.fulfill({ status: 200, contentType: type, body, headers: { 'access-control-allow-origin': '*' } });
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__violations = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__violations.push(`${e.violatedDirective} blocked ${e.blockedURI}`));
  });
  await page.goto(origin + '/');
  await page.waitForTimeout(800);

  const violations = await page.evaluate(() => window.__violations);
  check('the page loads with nothing blocked', violations.length === 0, violations.join('\n'));

  const state = await page.evaluate(() => ({
    ready: document.documentElement.dataset.ready === 'yes',
    gtag: window.__gtagLoaded === true,
    image: document.querySelector('.hero')?.complete && document.querySelector('.hero')?.naturalWidth > 0,
  }));
  const frameLoaded = page.frames().some((f) => f.url().includes('youtube-nocookie.com'));
  const missing = [!state.ready && "the page's own script", !state.gtag && 'the Google tag', !state.image && 'the hero image', !frameLoaded && 'the video iframe'].filter(Boolean);
  check('everything the page needs still works', missing.length === 0, 'Blocked or broken: ' + missing.join(', '));

  const named = allSources.filter((s) => /^(https?:\/\/)?[a-z0-9.-]+\.[a-z]{2,}(:\d+)?(\/.*)?$/i.test(s)).map((s) => new URL(s.includes('://') ? s : 'https://' + s).hostname);
  const extra = named.filter((h) => !expectedHosts.includes(h));
  check('the CSP only names hosts the page uses', csp.length > 0 && extra.length === 0, extra.length ? `The page never loads from: ${extra.join(', ')}` : 'There is no policy to look at yet.');

  await page.evaluate(() => {
    const s = document.createElement('script');
    s.src = 'https://evil.example/x.js';
    document.body.append(s);
  });
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({ ran: window.__evilRan === true, blocked: window.__violations.some((v) => v.includes('evil.example')) }));
  check('a script from an unknown host is blocked', after.blocked && !after.ran, 'A script from https://evil.example ran. Your policy would let an attacker load code from anywhere.');
} finally {
  await browser.close();
  server.close();
}
