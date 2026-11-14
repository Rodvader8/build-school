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
const api = read('lib/bakery-api.js');
const body = (name) => (api.match(new RegExp(`export async function ${name}\\(\\)\\s*\\{([\\s\\S]*?)\\n\\}`)) ?? [])[1] ?? '';
check('the menu function is marked "use cache" with a lifetime and a tag', /^\s*(['"])use cache\1/.test(body('getMenu')) && /cacheLife\(/.test(body('getMenu')) && /cacheTag\(/.test(body('getMenu')), 'Start getMenu() with \'use cache\', then call cacheLife(\'hours\') and cacheTag(\'menu\').');
check('the oven status stays live (no cache)', body('getOvenStatus').length > 0 && !/use cache/.test(body('getOvenStatus')), 'getOvenStatus() changes by the minute. Leave "use cache" off it.');
check('the home page sends a loading fallback for the live part', builds && /Checking the oven/.test(html('/')) && !/Loaves left today: \d/.test(html('/')), builds ? 'The prerendered home page should contain the fallback "Checking the oven..." and not the live number.' : 'Fix the build first. If it says data was accessed outside of <Suspense>, wrap the live component in <Suspense>.');
check('the menu is prerendered into the page', builds && ['Bread', 'Pastry', 'Country sourdough', 'Cardamom bun'].every((t) => html('/menu').includes(t)), builds ? 'The prerendered /menu page should already contain the menu.' : 'Fix the build first. Uncached data in a page needs "use cache" or <Suspense>.');
