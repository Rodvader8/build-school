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
const routes = read('.next/app-path-routes-manifest.json');
check('the build includes the /api/enquiry route', builds && /"\/api\/enquiry\/route"/.test(routes), 'Create app/api/enquiry/route.js and export an async POST function.');
const codeFiles = ['app/api/enquiry/route.js', 'lib/notify.js', 'lib/validate.js'];
check('the code has no hard-coded addresses or keys', codeFiles.every((f) => !/https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(read(f).replace(/^\s*\/\/.*$/gm, ''))) && /process\.env\.ENQUIRY_WEBHOOK_URL/.test(read('lib/notify.js')), 'Move the webhook address out of the code: read process.env.ENQUIRY_WEBHOOK_URL in lib/notify.js.');
const example = read('.env.example');
check('.env.example documents the variable with a fake value, and .env is ignored', /^ENQUIRY_WEBHOOK_URL=\S*(example|REPLACE|FAKE)/mi.test(example) && /^\.env$/m.test(read('.gitignore')), 'Add .env.example with ENQUIRY_WEBHOOK_URL=https://hooks.example.invalid/... (a fake value). The real one goes in .env, which is already git-ignored.');
const clientFiles = sourceFiles.filter((f) => /\.jsx?$/.test(f) && /^\s*(['"])use client\1/.test(read(f)));
check('the contact page is a server page and only the form is a client component', builds && html('/contact').includes('name="website"') && clientFiles.length === 1 && /EnquiryForm/.test(clientFiles[0]), 'Only components/EnquiryForm.jsx needs "use client".');
