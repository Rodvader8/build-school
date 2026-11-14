// Check my work: tests each part of the checklist in throwaway folders and on a local port. Nothing is deployed.
// Every check prints PASS or FAIL. Open this file if you're curious.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const here = process.cwd();
const sandbox = mkdtempSync(path.join(os.tmpdir(), 'bs-security-'));
process.on('exit', () => rmSync(sandbox, { recursive: true, force: true }));
const load = (file) => import(pathToFileURL(path.join(here, file)).href);
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const walk = (d) => (existsSync(d) ? readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)])) : []);

const mods = {};
const errors = {};
for (const [k, f] of [['headers', 'src/headers.js'], ['validate', 'src/validate.js'], ['ratelimit', 'src/ratelimit.js'], ['app', 'src/app.js']]) {
  try {
    mods[k] = await load(f);
  } catch (e) {
    errors[k] = e.message.split('\n')[0];
  }
}
const T = (name, key, fn, why) => {
  try {
    check(name, !!mods[key] && fn(mods[key]) === true, mods[key] ? why : `${key} didn't load: ${errors[key]}`);
  } catch (e) {
    check(name, false, e.message.split('\n')[0]);
  }
};

/* ---- headers ---- */
T('the CSP starts from default-src self and sets the directives that have no fallback', 'headers', (m) => {
  const h = m.securityHeaders();
  const csp = h['Content-Security-Policy'] ?? '';
  const dir = (n) => new RegExp(`(?:^|;)\\s*${n}\\s+([^;]*)`).exec(csp)?.[1].trim();
  const scripts = dir('script-src') ?? dir('default-src') ?? '';
  return dir('default-src') === "'self'" && dir('object-src') === "'none'" && dir('base-uri') === "'self'" && dir('form-action') === "'self'" && ['none', 'self'].includes(dir('frame-ancestors')?.replace(/'/g, '')) && !/unsafe-inline|unsafe-eval|(^|\s)\*(\s|$)/.test(scripts);
}, "Content-Security-Policy needs default-src 'self', object-src 'none', base-uri 'self', form-action 'self' and frame-ancestors 'none'. Nothing in script-src may be 'unsafe-inline', 'unsafe-eval' or *.");

T('HSTS, nosniff, a referrer policy and a permissions policy are set', 'headers', (m) => {
  const h = Object.fromEntries(Object.entries(m.securityHeaders()).map(([k, v]) => [k.toLowerCase(), String(v)]));
  const age = Number(/max-age=(\d+)/.exec(h['strict-transport-security'] ?? '')?.[1] ?? 0);
  return age >= 15552000 && /includesubdomains/i.test(h['strict-transport-security']) && h['x-content-type-options'] === 'nosniff' && /strict-origin|no-referrer|same-origin/.test(h['referrer-policy'] ?? '') && /camera=\(\)/.test(h['permissions-policy'] ?? '') && /microphone=\(\)/.test(h['permissions-policy']) && /geolocation=\(\)/.test(h['permissions-policy']) && !('x-powered-by' in h);
}, 'Strict-Transport-Security: max-age of 15552000 or more plus includeSubDomains. X-Content-Type-Options: nosniff. A strict Referrer-Policy. A Permissions-Policy that switches off camera, microphone and geolocation.');

/* ---- validation ---- */
T('validateSignup accepts a good signup and returns only the allowed fields, cleaned', 'validate', (m) => {
  const r = m.validateSignup({ name: '  Ana Silva\u0000 ', email: '  ANA@Example.com ', message: 'Hello', role: 'admin', isAdmin: true });
  const bare = m.validateSignup({ name: 'Bo', email: 'bo@example.com' });
  return r.ok === true && JSON.stringify(r.value) === JSON.stringify({ name: 'Ana Silva', email: 'ana@example.com', message: 'Hello' }) && bare.ok && !('message' in bare.value);
}, 'Trim, strip control characters, lower-case the email, and return a NEW object with only name, email and message. role and isAdmin must not come through.');

T('it rejects bad input with a message for each field', 'validate', (m) => {
  const bad = [
    [{}, ['name', 'email']],
    [{ name: 'A'.repeat(81), email: 'a@b.co' }, ['name']],
    [{ name: 'Ana', email: 'not-an-email' }, ['email']],
    [{ name: 'Ana', email: 'a@b.co', message: 'x'.repeat(1001) }, ['message']],
    [{ name: 42, email: ['a@b.co'] }, ['name', 'email']],
  ];
  const fields = bad.every(([input, keys]) => {
    const r = m.validateSignup(input);
    return r.ok === false && r.value === null && keys.every((k) => typeof r.errors[k] === 'string' && r.errors[k].length > 3);
  });
  return fields && [null, 'text', 7, ['a']].every((x) => m.validateSignup(x).ok === false);
}, 'Every field needs a string of the right length and shape. Numbers, arrays and missing values are errors, and so is anything that is not an object.');

/* ---- rate limiting ---- */
T('the limiter allows the limit, then blocks with a retry time', 'ratelimit', (m) => {
  let t = 1000;
  const l = m.createLimiter({ limit: 3, windowMs: 60_000, now: () => t });
  const first = [l.check('ip'), l.check('ip'), l.check('ip')];
  t += 15_000;
  const fourth = l.check('ip');
  return first.every((r) => r.allowed) && first[2].remaining === 0 && first[0].remaining === 2 && fourth.allowed === false && fourth.retryAfterSeconds === 45;
}, 'Count requests per key in a window. Request 4 of 3 is blocked, with retryAfterSeconds = how long until the window ends, rounded up.');

T('every key has its own allowance, and the window resets', 'ratelimit', (m) => {
  let t = 0;
  const l = m.createLimiter({ limit: 1, windowMs: 1000, now: () => t });
  const a = l.check('a');
  const a2 = l.check('a');
  const b = l.check('b');
  t = 1000;
  const a3 = l.check('a');
  return a.allowed && !a2.allowed && b.allowed && a3.allowed;
}, 'Keep a separate counter per key. When windowMs has passed, the key starts again from zero.');

/* ---- the app, on a real port ---- */
if (mods.app && mods.ratelimit && mods.headers && mods.validate) {
  const app = mods.app.createApp({ limiter: mods.ratelimit.createLimiter({ limit: 8, windowMs: 60_000 }), maxBodyBytes: 2000 });
  await new Promise((r) => app.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${app.address().port}`;
  const post = (body, raw = false) => fetch(`${base}/signup`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: raw ? body : JSON.stringify(body) }).catch(() => null);
  const sent = [await fetch(base + '/'), await fetch(base + '/missing'), await post({ name: 'Ana', email: 'ana@example.com' })];
  const hdrs = mods.headers.securityHeaders();
  const everyHeader = sent.every((r) => Object.keys(hdrs).every((k) => r.headers.get(k) !== null)) && sent.every((r) => !r.headers.has('x-powered-by'));
  check('the app sends the security headers on every response', Object.keys(hdrs).length >= 5 && everyHeader, 'securityHeaders() has to return at least five headers, and the app sends every one on every response.');
  const bad = await post({ name: '', email: 'nope' });
  const junk = await post('{not json', true);
  const huge = await post({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5000) });
  const badBody = await bad.json().catch(() => ({}));
  check('the app answers 400 for bad input and bad JSON, and 413 for an oversized body', bad.status === 400 && typeof badBody.errors?.name === 'string' && junk.status === 400 && (huge === null || huge.status === 413), `Got ${bad.status} for bad input, ${junk.status} for bad JSON, ${huge?.status} for a huge body.`);
  let limited = null;
  for (let i = 0; i < 12 && !limited; i++) {
    const r = await fetch(base + '/');
    if (r.status === 429) limited = r;
  }
  check('the app answers 429 with a Retry-After header once the limit is hit', limited?.status === 429 && Number(limited.headers.get('retry-after')) > 0, 'The limiter should block after its limit and the app should say how long to wait.');
  app.close();
} else {
  for (const n of ['the app sends the security headers on every response', 'the app answers 400 for bad input and bad JSON, and 413 for an oversized body', 'the app answers 429 with a Retry-After header once the limit is hit']) check(n, false, `The app needs headers.js, validate.js and ratelimit.js to load first: ${Object.values(errors)[0] ?? ''}`);
}

/* ---- the secrets scanner ---- */
const FAKE = {
  openai: ['sk', 'proj', 'FAKEFAKEFAKEFAKE1234567'].join('-'),
  aws: 'AKIA' + 'FAKEFAKEFAKE1234',
  github: 'ghp_' + 'F'.repeat(36),
  pem: '-----BEGIN RSA ' + 'PRIVATE KEY-----',
  assigned: 'const apiKey = "' + 'a1B2c3D4e5F6g7H8i9J0' + '";',
};
const scan = (dir) => spawnSync(process.execPath, [path.join(here, 'scripts/scan-secrets.mjs'), dir], { encoding: 'utf8' });
{
  const dirty = path.join(sandbox, 'dirty');
  mkdirSync(path.join(dirty, 'src'), { recursive: true });
  mkdirSync(path.join(dirty, 'node_modules/pkg'), { recursive: true });
  writeFileSync(path.join(dirty, 'src/a.js'), `// fine\nconst k = "${FAKE.openai}";\n`);
  writeFileSync(path.join(dirty, 'src/b.js'), `${FAKE.assigned}\nconst aws = "${FAKE.aws}";\n`);
  writeFileSync(path.join(dirty, 'notes.md'), `token: ${FAKE.github}\n${FAKE.pem}\n`);
  writeFileSync(path.join(dirty, 'node_modules/pkg/index.js'), `const x = "${FAKE.openai}";\n`);
  const r = scan(dirty);
  const text = r.stdout + r.stderr;
  const leaked = [FAKE.openai, FAKE.aws, FAKE.github, 'a1B2c3D4e5F6g7H8i9J0'].some((s) => text.includes(s.slice(6)));
  check('the scanner exits 1 on key-shaped strings and says where, never what', r.status === 1 && /a\.js:2/.test(text) && /b\.js:1/.test(text) && /b\.js:2/.test(text) && /notes\.md:1/.test(text) && /notes\.md:2/.test(text) && !/node_modules/.test(text) && !leaked, r.status === 1 ? `Expected a.js:2, b.js:1, b.js:2, notes.md:1 and notes.md:2, and no secret in the output.\n${text.slice(0, 200)}` : `Exit code ${r.status}. A folder with keys in it must fail the scan.`);
  const clean = path.join(sandbox, 'clean');
  mkdirSync(clean, { recursive: true });
  writeFileSync(path.join(clean, 'a.js'), 'const sk = 1; // sk-short\nconst apiKey = process.env.API_KEY;\n');
  writeFileSync(path.join(clean, '.env.example'), 'API_KEY=your-key-here\nSUPABASE_URL=https://your-project.example\n');
  const c = scan(clean);
  const self = scan(here);
  check('the scanner exits 0 on a clean folder, and this project is clean', c.status === 0 && self.status === 0, `clean folder: exit ${c.status}. This project: exit ${self.status}.\n${(self.stdout + c.stdout).slice(0, 200)}`);
}
{
  const example = read('.env.example');
  const lines = example.split('\n').filter((l) => /^[A-Z_]+=/.test(l));
  const ignore = read('.gitignore').split('\n').map((l) => l.trim());
  check('.env is git-ignored, and .env.example holds placeholders only', ignore.includes('.env') && lines.length >= 2 && !existsSync('.env') && scan(here).status === 0, 'Add ".env" to .gitignore, keep a .env.example with obvious placeholders (your-key-here), and never commit the real file.');
}

/* ---- the offline dependency audit ---- */
{
  const audit = (report, allow) => spawnSync(process.execPath, [path.join(here, 'scripts/audit-offline.mjs'), report, ...(allow ? [allow] : [])], { encoding: 'utf8' });
  const high = path.join(here, 'fixtures/npm-audit-high.json');
  const clean = path.join(here, 'fixtures/npm-audit-clean.json');
  const noAllow = path.join(sandbox, 'none.json');
  writeFileSync(noAllow, '[]');
  const a = audit(high, noAllow);
  check('the audit fails on high and critical findings, naming the package', a.status === 1 && /left-padder/.test(a.stdout) && /old-crypto/.test(a.stdout) && !/tiny-parser/.test(a.stdout.split('\n').filter((l) => /block/i.test(l)).join()), `Expected exit 1 and the two serious packages named. Got exit ${a.status}.\n${a.stdout.slice(0, 160)}`);
  const ok = audit(clean, noAllow);
  const allowFile = path.join(sandbox, 'allow.json');
  writeFileSync(allowFile, JSON.stringify([{ package: 'left-padder', reason: 'Only used in a build script', expires: '2099-01-01' }, { package: 'old-crypto', reason: 'Waiting on upstream', expires: '2099-01-01' }]));
  const allowed = audit(high, allowFile);
  const expiredFile = path.join(sandbox, 'expired.json');
  writeFileSync(expiredFile, JSON.stringify([{ package: 'left-padder', reason: 'Only used in a build script', expires: '2020-01-01' }, { package: 'old-crypto', reason: '', expires: '2099-01-01' }]));
  const expired = audit(high, expiredFile);
  check('it passes a clean report, honours an allow list entry with a reason, and ignores an expired one', ok.status === 0 && allowed.status === 0 && expired.status === 1 && /left-padder/.test(expired.stdout) && /old-crypto/.test(expired.stdout), `clean: exit ${ok.status}. allowed: exit ${allowed.status}. expired or reasonless: exit ${expired.status} (should be 1, naming both).`);
}

/* ---- Row Level Security ---- */
{
  const schema = read('db/schema.sql');
  const sql = read('db/policies.sql').replace(/--.*$/gm, '');
  const statements = sql.split(';').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const tables = [...schema.matchAll(/create table public\.(\w+)/gi)].map((m) => m[1]);
  const enabled = (t) => statements.some((s) => new RegExp(`^alter table public\\.${t} enable row level security$`, 'i').test(s));
  const policies = (t) => statements.filter((s) => new RegExp(`^create policy .+ on public\\.${t} for (select|insert|update|delete|all)\\b`, 'i').test(s));
  const missingRls = tables.filter((t) => !enabled(t));
  check('every table in schema.sql has row level security switched on', tables.length >= 3 && missingRls.length === 0, `No "alter table public.${missingRls[0]} enable row level security;" yet. A table without RLS is open to anyone with the anon key.`);
  const kind = (s) => /for (select|insert|update|delete|all)/i.exec(s)[1].toLowerCase();
  const noPolicy = tables.filter((t) => !policies(t).some((s) => ['select', 'all'].includes(kind(s))));
  const weak = tables.flatMap((t) => policies(t).filter((s) => /\b(true|1 ?= ?1)\b/i.test(s.replace(/auth\.uid\(\)/g, '')) || (kind(s) !== 'select' && !/auth\.uid\(\)/.test(s))));
  check('every table has policies tied to auth.uid(), and none is open to everyone', tables.length >= 3 && noPolicy.length === 0 && weak.length === 0, noPolicy.length ? `public.${noPolicy[0]} has RLS on but no select policy, so nobody can read it.` : `This policy lets too much through: ${weak[0]?.slice(0, 90)}\nEvery policy that writes must compare the row's owner to auth.uid(), and none may say "true".`);
  const browserCode = walk('public').map(read).join('\n');
  check('the service role key stays out of anything the browser loads', browserCode.length > 0 && !/service[_-]?role/i.test(browserCode) && /anonKey/.test(browserCode), 'Anything in public/ is readable by every visitor. Use the anon key there. The service role key bypasses RLS and lives only on a server.');
}
