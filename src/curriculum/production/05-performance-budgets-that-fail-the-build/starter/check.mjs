// Check my work: measures real and synthetic builds against your budgets, then runs the Lighthouse assertions.
// Everything is local. Every check prints PASS or FAIL. Open this file if you're curious.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { randomBytes } from 'node:crypto';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const here = process.cwd();
const sandbox = mkdtempSync(path.join(os.tmpdir(), 'bs-budgets-'));
process.on('exit', () => rmSync(sandbox, { recursive: true, force: true }));
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const json = (f) => {
  try {
    return JSON.parse(read(f));
  } catch {
    return null;
  }
};

/** A fake build: index.html loads one script, preloads another, and there's one lazy chunk, one CSS file and some images. */
function fakeDist(name, { initial, preload, lazy, css, images }) {
  const dist = path.join(sandbox, name, 'dist');
  mkdirSync(path.join(dist, 'assets'), { recursive: true });
  const write = (rel, data) => writeFileSync(path.join(dist, rel), data);
  write('assets/main.js', randomBytes(initial).toString('base64'));
  write('assets/vendor.js', randomBytes(preload).toString('base64'));
  write('assets/chart.js', randomBytes(lazy).toString('base64'));
  write('assets/site.css', 'a{color:red}'.repeat(css));
  images.forEach((n, i) => write(`photo${i}.jpg`, randomBytes(n)));
  write('index.html', '<!doctype html><head><link rel="modulepreload" href="/assets/vendor.js"><script type="module" src="/assets/main.js"></script></head><body>fake</body>');
  return dist;
}
const lean = { initial: 6000, preload: 4000, lazy: 90000, css: 200, images: [40000, 20000] };
const bloated = { initial: 90000, preload: 60000, lazy: 90000, css: 9000, images: [600000, 20000] };
const gz = (file) => gzipSync(readFileSync(file)).length;

let mod = null;
let loadError = '';
try {
  mod = await import(pathToFileURL(path.join(here, 'scripts/budgets.mjs')).href);
} catch (e) {
  loadError = e.message.split('\n')[0];
}
const T = (name, fn, why) => {
  try {
    check(name, !!mod && fn(mod) === true, mod ? why : `budgets.mjs didn't load: ${loadError}`);
  } catch (e) {
    check(name, false, e.message.split('\n')[0]);
  }
};

T('measure() reports gzip sizes for initial JS, lazy JS, CSS and images', (m) => {
  const dist = fakeDist('measure', lean);
  const r = m.measure(dist);
  const near = (a, b) => Math.abs(a - b) <= b * 0.02 + 8;
  const initial = gz(path.join(dist, 'assets/main.js')) + gz(path.join(dist, 'assets/vendor.js'));
  return near(r.initialJs, initial) && near(r.lazyJs, gz(path.join(dist, 'assets/chart.js'))) && r.css > 0 && r.css < 500 && r.images.length === 2 && r.images.some((i) => i.bytes === 40000 && /photo0\.jpg$/.test(i.file)) && r.initialTotal > r.initialJs + 60000;
}, 'initialJs is the gzip size of every script index.html loads (script src and modulepreload). Anything else ending .js is lazyJs. Images are counted as they are, and initialTotal adds the page, initial JS, CSS files and images.');

T('evaluate() returns one violation for each budget that is over', (m) => {
  const budgets = { initialJsKB: 30, cssKB: 10, imageKB: 150, initialTotalKB: 200 };
  const measured = { initialJs: 40 * 1024, lazyJs: 999999, css: 2 * 1024, images: [{ file: 'a.jpg', bytes: 160 * 1024 }, { file: 'b.jpg', bytes: 10 }], initialTotal: 150 * 1024 };
  const v = m.evaluate(measured, budgets);
  const clean = m.evaluate({ initialJs: 1, lazyJs: 9e9, css: 1, images: [], initialTotal: 1 }, budgets);
  return v.length === 2 && v.map((x) => x.budget).sort().join() === 'imageKB,initialJsKB' && v.find((x) => x.budget === 'initialJsKB').limit === 30 && v.find((x) => x.budget === 'initialJsKB').actual === 40 && clean.length === 0;
}, 'Compare each measured number (in KB) with its budget. Lazy JavaScript has no budget: that is the point of splitting it off.');

const budgets = json('budgets.json');
const ceilings = { initialJsKB: 60, cssKB: 20, imageKB: 250, initialTotalKB: 400 };
check(
  'budgets.json sets all four budgets, at sensible ceilings',
  !!budgets && Object.entries(ceilings).every(([k, max]) => typeof budgets[k] === 'number' && budgets[k] > 0 && budgets[k] <= max),
  `Set initialJsKB (60 at most), cssKB (20), imageKB (250) and initialTotalKB (400). A budget you can't fail isn't a budget. You have: ${JSON.stringify(budgets)}`,
);

const cli = (dist, file = 'budgets.json') => spawnSync(process.execPath, [path.join(here, 'scripts/budgets.mjs'), dist, file], { cwd: here, encoding: 'utf8' });
{
  const fat = cli(fakeDist('fat', bloated));
  const fit = cli(fakeDist('fit', lean));
  const text = fat.stderr + fat.stdout;
  check('the budget script exits 1 on a bloated build and names every budget it broke', !!budgets && fat.status === 1 && ['initialJsKB', 'imageKB', 'initialTotalKB'].every((b) => text.includes(b)) && /OVER BUDGET/.test(text), `Exit ${fat.status}. It should print "OVER BUDGET  <budget>: ..." for each budget that's over, then exit 1.\n${text.slice(0, 160)}`);
  check('the budget script exits 0 on a lean build', !!budgets && fit.status === 0, `Exit ${fit.status}. ${(fit.stderr + fit.stdout).slice(0, 160)}`);
}

/* ---- the real app ---- */
const pkg = json('package.json') ?? {};
check('npm run build runs the budget check after the build', /vite build\s*&&\s*node scripts\/budgets\.mjs/.test(pkg.scripts?.build ?? ''), 'The build script should be: vite build && node scripts/budgets.mjs. If the second part fails, the build fails.');
if (!existsSync('node_modules/vite')) {
  for (const n of ['the real build passes its budgets, with the chart code split off to load on demand', 'a tighter budget makes the real build fail', 'lighthouse-assertions.json lists the structural audits', 'Lighthouse structural assertions pass on the built app', 'the Lighthouse assertions catch a page with an unsized image']) check(n, false, 'Run "npm install" in the terminal first.');
  process.exit(0);
}
const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8', timeout: 180000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
const m = mod && existsSync('dist/index.html') ? mod.measure('dist') : null;
check('the real build passes its budgets, with the chart code split off to load on demand', build.status === 0 && !!m && m.lazyJs > 50000 && m.initialJs < 60 * 1024, build.status === 0 ? 'The build passed, but the big chart code is still in the initial bundle (or gone). Load it with import() when someone clicks.' : `${(build.stdout + build.stderr).split('\n').filter((l) => /OVER BUDGET|error|budgets/i.test(l)).slice(0, 4).join('\n') || 'npm run build failed.'}`);
if (existsSync('dist/index.html')) {
  const tight = path.join(sandbox, 'tight.json');
  writeFileSync(tight, JSON.stringify({ initialJsKB: 0.1, cssKB: 0.1, imageKB: 1, initialTotalKB: 1 }));
  const r = cli('dist', tight);
  check('a tighter budget makes the real build fail', r.status === 1, `With absurdly small limits the script should exit 1. It exited ${r.status}.`);
} else check('a tighter budget makes the real build fail', false, 'There is no dist/ to measure.');

const rules = json('lighthouse-assertions.json');
check('lighthouse-assertions.json lists the structural audits', !!rules && ['unsized-images', 'render-blocking-insight', 'image-size-responsive'].every((id) => rules.mustPass?.includes(id)) && typeof rules.maxNumeric?.['total-byte-weight'] === 'number' && rules.maxNumeric['total-byte-weight'] <= 500000, 'mustPass needs unsized-images, render-blocking-insight and image-size-responsive. maxNumeric needs total-byte-weight, at 500000 bytes or less.');
const lh = (dist) => spawnSync(process.execPath, [path.join(here, 'scripts/assert-lighthouse.mjs'), dist, 'lighthouse-assertions.json'], { cwd: here, encoding: 'utf8', timeout: 150000 });
if (existsSync('dist/index.html') && rules) {
  const real = lh('dist');
  check('Lighthouse structural assertions pass on the built app', real.status === 0, (real.stdout + real.stderr).split('\n').filter((l) => /FAIL|rror/.test(l)).slice(0, 4).join('\n') || `Exit ${real.status}.`);
} else check('Lighthouse structural assertions pass on the built app', false, 'Build the app and write lighthouse-assertions.json first.');
if (rules) {
  const bad = path.join(sandbox, 'badsite');
  mkdirSync(bad, { recursive: true });
  writeFileSync(path.join(bad, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x</title><meta name="viewport" content="width=device-width"></head><body><img src="/p.jpg" alt="a photo"></body></html>');
  writeFileSync(path.join(bad, 'p.jpg'), readFileSync('public/hero.jpg'));
  const r = lh(bad);
  check('the Lighthouse assertions catch a page with an unsized image', r.status === 1 && /FAIL lighthouse unsized-images/.test(r.stdout), `A page with <img> and no width or height should fail unsized-images. Exit ${r.status}.`);
} else check('the Lighthouse assertions catch a page with an unsized image', false, 'lighthouse-assertions.json is missing or not valid JSON.');
