// Check my work: starts your app on a local port, loads it in a real browser, and checks every part of "production ready".
// Nothing is deployed and nothing leaves this machine. Every check prints PASS or FAIL. Open this file if you're curious.
import { spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const here = process.cwd();
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const json = (f) => {
  try {
    return JSON.parse(read(f));
  } catch {
    return null;
  }
};
const sandbox = mkdtempSync(path.join(os.tmpdir(), 'bs-prod-'));
process.on('exit', () => rmSync(sandbox, { recursive: true, force: true }));
const npm = (...args) => spawnSync('npm', args, { encoding: 'utf8', timeout: 240000, env: { ...process.env, CI: 'true', NO_COLOR: '1', FORCE_COLOR: '0' } });
const tail = (r) => (r.stdout + r.stderr).split('\n').filter((l) => /\S/.test(l) && !/^>|npm (error|ERR)/.test(l)).slice(-4).join('\n');

if (!existsSync('node_modules/yaml') || !existsSync('node_modules/playwright')) {
  out('FAIL dependencies are installed');
  out('  Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { parse } = await import('yaml');

/* ---- 1. CI ---- */
let wf = null;
let yamlError = existsSync('.github/workflows/ci.yml') ? '' : '.github/workflows/ci.yml is missing.';
if (!yamlError) {
  try {
    wf = parse(read('.github/workflows/ci.yml'));
  } catch (e) {
    yamlError = e.message.split('\n')[0];
  }
}
const job = Object.values(wf?.jobs ?? {})[0];
const steps = job?.steps ?? [];
const uses = steps.filter((s) => s.uses);
const commands = steps.filter((s) => s.run).flatMap((s) => String(s.run).split('\n').map((l) => l.trim()).filter(Boolean));
const at = (re) => commands.findIndex((c) => re.test(c));
const [iCi, iLint, iTest, iBuild] = [at(/^npm ci\b/), at(/^npm run lint\b/), at(/^npm (run )?test\b/), at(/^npm run build\b/)];
const triggers = Array.isArray(wf?.on) ? wf.on : Object.keys(wf?.on ?? {});
const scripts = json('package.json')?.scripts ?? {};
check(
  'the CI workflow is valid and runs install, lint, test and build in order',
  !yamlError && triggers.includes('push') && triggers.includes('pull_request') && job?.['runs-on'] === 'ubuntu-latest' && uses.some((s) => s.uses.startsWith('actions/checkout@')) && uses.some((s) => s.uses.startsWith('actions/setup-node@') && s.with?.cache === 'npm') && iCi !== -1 && iCi < iLint && iLint < iTest && iTest < iBuild && commands.filter((c) => /^npm run (\S+)/.test(c)).every((c) => scripts[/^npm run (\S+)/.exec(c)[1]]),
  yamlError || 'It needs push and pull_request triggers, ubuntu-latest, checkout, setup-node with cache: npm, then npm ci, lint, test and build in that order. Every npm run it calls must exist.',
);
check(
  'the workflow pins its actions, is read-only, has a timeout and cancels stale runs',
  !!wf && uses.length > 0 && uses.every((s) => /@(v?\d[\w.]*|[0-9a-f]{40})$/.test(s.uses)) && wf.permissions?.contents === 'read' && Number(job?.['timeout-minutes']) > 0 && wf.concurrency?.['cancel-in-progress'] === true,
  'Pin every action to a version, add "permissions: contents: read", set timeout-minutes on the job, and add concurrency with cancel-in-progress: true.',
);

/* ---- 2. the pipeline, run for real ---- */
const ci = npm('run', 'ci');
check('npm run ci passes: secrets scan, lint, tests and a build within budget', ci.status === 0, tail(ci));
{
  const tight = path.join(sandbox, 'tight.json');
  writeFileSync(tight, JSON.stringify({ initialJsKB: 0.05, cssKB: 0.05, imageKB: 1, initialTotalKB: 0.1 }));
  const r = existsSync('dist/index.html') ? spawnSync(process.execPath, ['scripts/budgets.mjs', 'dist', tight], { encoding: 'utf8' }) : { status: -1 };
  const b = json('budgets.json');
  check('the build fails when a budget is broken', /scripts\/budgets\.mjs/.test(scripts.build ?? '') && !!b && ['initialJsKB', 'cssKB', 'imageKB', 'initialTotalKB'].every((k) => b[k] > 0 && b[k] <= { initialJsKB: 60, cssKB: 20, imageKB: 250, initialTotalKB: 400 }[k]) && r.status === 1, 'package.json build must end with node scripts/budgets.mjs, and budgets.json needs all four limits (initialJsKB 60 at most, cssKB 20, imageKB 250, initialTotalKB 400).');
}

/* ---- 3. the app ---- */
let mod = null;
let loadError = '';
try {
  mod = await import(pathToFileURL(path.join(here, 'server.js')).href);
} catch (e) {
  loadError = e.message.split('\n')[0];
}
const start = async (options = {}) => {
  const app = mod.createApp(options);
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  return { app, base: `http://127.0.0.1:${app.address().port}` };
};
const NEED = ['the security headers are on every response, including 404s and crashes', 'the page works under its own CSP, with no inline code and no console errors', 'GET /healthz answers 200 with status, version and uptime', 'the health check answers 503 when something it depends on is missing', 'a crash in a route is reported scrubbed, and the visitor gets a plain 500', 'a browser error is reported to the server, scrubbed'];
if (!mod || !existsSync('dist/index.html')) for (const n of NEED) check(n, false, mod ? 'Build the site first (npm run build).' : `server.js didn't load: ${loadError}`);
else {
  const { createReporter } = await import(pathToFileURL(path.join(here, 'lib/reporter.js')).href);
  const spy = [];
  const reporter = createReporter({ endpoint: 'http://monitor.invalid/ingest', release: 'check', send: (_u, event) => spy.push(event) });
  const clientErrors = [];
  const crash = { '/api/boom': () => { throw new Error('boom for ana@example.com token=abc123xyz'); } };
  const { app, base } = await start({ reporter, extraRoutes: crash, onClientError: (e) => clientErrors.push(e) });

  // headers on everything
  const responses = await Promise.all(['/', '/api/summary', '/nope', '/healthz', '/api/boom'].map((p) => fetch(base + p)));
  const bad = responses.filter((r) => {
    const csp = r.headers.get('content-security-policy') ?? '';
    return !/default-src 'self'/.test(csp) || !/object-src 'none'/.test(csp) || !/frame-ancestors/.test(csp) || /unsafe-eval/.test(csp) || Number(/max-age=(\d+)/.exec(r.headers.get('strict-transport-security') ?? '')?.[1] ?? 0) < 15552000 || r.headers.get('x-content-type-options') !== 'nosniff' || !r.headers.get('referrer-policy');
  });
  check(NEED[0], bad.length === 0, `${bad.length} of 5 responses are missing something: ${responses.map((r, i) => (bad.includes(r) ? ['/', '/api/summary', '/nope', '/healthz', '/api/boom'][i] : null)).filter(Boolean).join(', ')}. Set securityHeaders() at the very top of the handler, before anything can throw or return.`);

  // the crash
  const boom = responses[4];
  const body = await boom.text();
  await new Promise((r) => setTimeout(r, 100));
  const e = spy[0];
  check(NEED[4], boom.status === 500 && !/boom|ana@|abc123/.test(body) && spy.length >= 1 && e.type === 'server' && !/ana@example|abc123xyz/.test(JSON.stringify(e)), `Status ${boom.status}. Wrap the whole handler with wrapHandler(handler, { reporter }), so a crash is reported and the visitor sees only a generic 500. Reported: ${spy.length} event(s).`);

  // health
  const h = await fetch(base + '/healthz');
  const hb = await h.json().catch(() => ({}));
  check(NEED[2], h.status === 200 && hb.status === 'ok' && typeof hb.version === 'string' && typeof hb.uptimeSeconds === 'number' && typeof hb.checks === 'object' && /no-store/.test(h.headers.get('cache-control') ?? ''), `Expected 200 and { status: "ok", version, uptimeSeconds, checks } with Cache-Control: no-store. Got ${h.status} ${JSON.stringify(hb).slice(0, 100)}.`);
  const { app: sick, base: sickBase } = await start({ reporter, dataFile: path.join(sandbox, 'missing.json') });
  const s = await fetch(sickBase + '/healthz');
  const sb = await s.json().catch(() => ({}));
  check(NEED[3], s.status === 503 && sb.status === 'degraded' && sb.checks?.data === 'missing', `With the data file missing it should answer 503 and "degraded", naming what's wrong. Got ${s.status} ${JSON.stringify(sb).slice(0, 100)}.`);
  sick.close();

  // the browser
  const html = read('dist/index.html');
  const inline = /<script(?![^>]*\ssrc=)(?![^>]*application\/ld\+json)[^>]*>/i.test(html) || /\sstyle\s*=/.test(html) || /\son[a-z]+\s*=\s*["']/i.test(html);
  let browser;
  let note = '';
  const consoleErrors = [];
  let kpis = 0;
  try {
    const { chromium } = await import('playwright');
    browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', () => {});
    await page.goto(base + '/');
    await page.waitForSelector('.kpi', { timeout: 5000 }).catch(() => {});
    kpis = await page.locator('.kpi').count();
    await page.evaluate(() => setTimeout(() => { throw new Error('Client crash for ana@example.com'); }, 0));
    const end = Date.now() + 3000;
    while (clientErrors.length === 0 && Date.now() < end) await new Promise((r) => setTimeout(r, 50));
    await new Promise((r) => setTimeout(r, 200));
  } catch (err) {
    note = err.message.split('\n')[0];
  } finally {
    await browser?.close();
  }
  check(NEED[1], !note && !inline && kpis === 4 && consoleErrors.length === 0, note || (inline ? 'dist/index.html has inline code (a <script> without src, a style attribute or an on...= handler). A strict CSP blocks those.' : `The page showed ${kpis} KPI tiles and logged: ${consoleErrors[0]?.slice(0, 140) ?? 'nothing'}. Everything has to work under the policy you send.`));
  check(NEED[5], clientErrors.length >= 1 && clientErrors[0].type === 'error' && /Client crash/.test(clientErrors[0].message) && !/ana@example/.test(JSON.stringify(clientErrors[0])), 'src/app.js should install the browser reporter (installBrowserReporter) pointed at /api/errors, so a browser error reaches the server cleaned.');
  app.close();
}

/* ---- 4. secrets and the runbook ---- */
{
  const scan = spawnSync(process.execPath, ['scripts/scan-secrets.mjs', '.'], { encoding: 'utf8' });
  const ignore = read('.gitignore').split('\n').map((l) => l.trim());
  check('the secrets scan passes, .env is git-ignored and .env.example has placeholders only', scan.status === 0 && ignore.includes('.env') && existsSync('.env.example') && !existsSync('.env') && scripts.scan && /scan/.test(scripts.ci ?? ''), `Scan exit ${scan.status}. Add .env to .gitignore, keep .env.example, and make npm run ci start with npm run scan.\n${scan.stdout.slice(0, 120)}`);
}
{
  const text = read('RUNBOOK.md');
  const sections = text.split(/^## /m).slice(1).map((s) => ({ title: s.split('\n')[0].toLowerCase(), body: s.split('\n').slice(1).join(' ') }));
  const needs = { deploy: /deploy|release/, 'roll back': /roll ?back/, errors: /error/, health: /health/, budgets: /budget/, secrets: /secret/ };
  const missing = Object.entries(needs).filter(([, re]) => !sections.some((s) => re.test(s.title) && s.body.split(/\s+/).length >= 20)).map(([k]) => k);
  const words = text.split(/\s+/).filter(Boolean).length;
  const refs = [...text.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
  check('RUNBOOK.md is short and covers deploy, roll back, errors, health, budgets and secrets', missing.length === 0 && words >= 150 && words <= 800 && /\/healthz/.test(text) && refs.every((r) => scripts[r]), missing.length ? `No section with real content for: ${missing.join(', ')}. Give each a "## heading" and at least a couple of sentences.` : `${words} words (150 to 800), must mention /healthz, and every "npm run x" it names must exist in package.json.`);
}
process.exit(0);
