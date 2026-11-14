// Check my work: runs the tests in tests/ (open them, they're short and readable), builds the site with
// `next build`, then looks inside what the build made. Every check prints PASS or FAIL.
// The build goes to .next while `next dev` keeps its own files in .next/dev, so a running dev server isn't disturbed.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1', NEXT_TELEMETRY_DISABLED: '1' };

if (!existsSync('node_modules/next') || !existsSync('node_modules/vitest')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

const clean = (s) =>
  String(s ?? '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(process.cwd()).join('.')
    .split('\n')
    .filter((l) => !/^\s*at /.test(l))
    .join('\n');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const sourceFiles = [...walk('app'), ...walk('components'), ...walk('lib')].filter((f) => /\.(jsx?|css)$/.test(f));
/** The prerendered HTML for a route, e.g. html('/') or html('/menu/sourdough'). Empty if the build didn't make it. */
const html = (route) => read(`.next/server/app/${route === '/' ? 'index' : route.replace(/^\//, '')}.html`);

/* ---- 1. the tests: each test title prints as one PASS or FAIL line ---- */
if (existsSync('tests')) {
  const resultFile = path.join(os.tmpdir(), `bs-next-${process.pid}.json`);
  spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${resultFile}`], { encoding: 'utf8', timeout: 300000, env });
  let report = null;
  try {
    report = JSON.parse(readFileSync(resultFile, 'utf8'));
  } catch {}
  rmSync(resultFile, { force: true });
  if (!report) {
    fail('the tests run', 'Vitest produced no report. Run "npx vitest run" in the terminal to see why.');
  } else {
    for (const file of report.testResults) {
      if (file.assertionResults.length === 0 && file.status === 'failed') fail(`${path.basename(file.name)} could not run`, clean(file.message));
      for (const t of file.assertionResults) {
        if (t.status === 'passed') pass(t.title);
        else fail(t.title, clean((t.failureMessages ?? [])[0]).split('\n').slice(0, 3).join('\n'));
      }
    }
  }
}

/* ---- 2. the site builds ---- */
const built = spawnSync('npx', ['next', 'build'], { encoding: 'utf8', timeout: 400000, env });
const buildLog = clean(built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Cannot|not found|failed|Uncached|outside of/i.test(l));
const builds = built.status === 0;
check('the site builds', builds, buildLog.join('\n') || 'next build failed. Run "npm run build" in the terminal to read the full message.');

/* ---- 3. what the build made ---- */
const home = html('/');
const imgs = home.match(/<img\b[^>]*>/g) ?? [];
const hero = imgs.find((i) => /hero\.jpg/.test(decodeURIComponent(i))) ?? '';
check('the hero image is eager and preloaded, the others are lazy', builds && !!hero && !/loading="lazy"/.test(hero) && /<link rel="preload" as="image"[^>]*hero/.test(decodeURIComponent(home)) && imgs.filter((i) => i !== hero).length >= 2 && imgs.filter((i) => i !== hero).every((i) => /loading="lazy"/.test(i)), 'Use <Image preload ... /> on the hero only. The gallery images keep the default, which is lazy.');
check('every image goes through next/image with alt, width and height', builds && imgs.length >= 3 && imgs.every((i) => /\balt="[^"]+"/.test(i) && /\bwidth="\d+"/.test(i) && /\bheight="\d+"/.test(i) && /\/_next\/image/.test(i)), 'Every <img> should come from <Image> with alt, width and height. A plain <img> has no /_next/image URL.');
const layout = read('app/layout.jsx');
check('fonts load with next/font/local from files in the repo', /from ['"]next\/font\/local['"]/.test(layout) && !/next\/font\/google/.test(layout) && walk('app/fonts').filter((f) => f.endsWith('.woff2')).length >= 2 && (layout.match(/localFont\(/g) ?? []).length >= 2, 'Use localFont({ src: "./fonts/..." }) twice. Never next/font/google.');
const builtCss = walk('.next/static').filter((f) => f.endsWith('.css')).map(read).join('\n');
check('the fonts are preloaded and swap in', builds && (home.match(/\.woff2\\?",\\?"font|\.woff2" as="font"/g) ?? []).length >= 2 && /font-display:\s*swap/.test(builtCss), 'Add display: "swap" to each localFont and check both are used in the layout.');
check('nothing is requested from Google', builds && !/googleapis|gstatic/.test(home + builtCss) && !/googleapis|gstatic/.test(layout), 'Remove any link or import that points at fonts.googleapis.com.');
check('headings use the display font through the theme', builds && /<h1 class="[^"]*font-display/.test(home) && /\.font-display\s*\{/.test(builtCss) && /var\(--font-instrument\)/.test(builtCss), 'Add @theme inline { --font-display: var(--font-instrument); } to globals.css.');
check('there are no inline style props', !sourceFiles.some((f) => /\.jsx?$/.test(f) && /style\s*=\s*\{/.test(read(f))), 'Remove style={{ ... }} and use classes.');
