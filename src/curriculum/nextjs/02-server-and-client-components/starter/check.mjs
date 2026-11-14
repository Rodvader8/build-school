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
const isClient = (f) => /^\s*(['"])use client\1/.test(read(f));
const clientFiles = sourceFiles.filter((f) => /\.jsx?$/.test(f) && isClient(f));
const needsBrowser = (f) => /use(State|Reducer|Effect|Ref)\b|onClick|onChange/.test(read(f));
const pageFiles = sourceFiles.filter((f) => /[\\/](page|layout)\.jsx?$/.test(f));
check(
  'only components that need state or events use "use client"',
  clientFiles.length >= 2 && clientFiles.every(needsBrowser) && !clientFiles.some((f) => pageFiles.includes(f) || /ProductCard/.test(f)),
  'Put "use client" at the top of AddToOrder.jsx and MenuBrowser.jsx only. Pages, layouts and ProductCard stay server components.',
);
check('the menu page is a server component that uses MenuBrowser', !isClient('app/menu/page.jsx') && /MenuBrowser/.test(read('app/menu/page.jsx')), 'Remove "use client" from app/menu/page.jsx and render <MenuBrowser items={...} /> from it.');
const names = ['Country sourdough', 'Seeded rye', 'Rosemary focaccia', 'Butter croissant', 'Cardamom bun', 'Almond tart'];
check('the menu is already in the HTML the server sends', builds && names.every((n) => html('/menu').includes(n)), builds ? 'The prerendered /menu page is missing some menu items.' : 'Fix the build first.');
const staticJs = walk('.next/static').filter((f) => f.endsWith('.js')).map(read).join('\n');
check('the supplier notes never reach the browser', builds && !/wholesale/.test(staticJs) && !/wholesale/.test(html('/menu')), 'The word "wholesale" is in the browser files. Strip supplierNote before passing items to a client component, and keep the data import out of client files.');
