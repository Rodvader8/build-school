// Check my work: runs the tests in tests/ (open them, they're short and readable), then builds the app.
// Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));

if (!existsSync('node_modules/react') || !existsSync('node_modules/vitest')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

/* ---- 1. the tests: each test title prints as one PASS or FAIL line ---- */
const resultFile = '.test-results.json';
spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${resultFile}`], {
  encoding: 'utf8',
  timeout: 300000,
  env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1' },
});
const clean = (s) =>
  String(s ?? '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(process.cwd()).join('.')
    .split('\n')
    .filter((l) => !/^\s*at /.test(l))
    .join('\n');
let report = null;
try {
  report = JSON.parse(readFileSync(resultFile, 'utf8'));
} catch {}
rmSync(resultFile, { force: true });
if (!report) {
  fail('the tests run', 'Vitest produced no report. Run "npx vitest run" in the terminal to see why.');
} else {
  for (const file of report.testResults) {
    if (file.assertionResults.length === 0 && file.status === 'failed') {
      fail(`${path.basename(file.name)} could not run`, clean(file.message));
    }
    for (const t of file.assertionResults) {
      if (t.status === 'passed') pass(t.title);
      else fail(t.title, clean((t.failureMessages ?? [])[0]).split('\n').slice(0, 3).join('\n'));
    }
  }
}

/* ---- 2. the app builds, and follows the house rules ---- */
const built = spawnSync('npm', ['run', 'build'], { encoding: 'utf8', timeout: 300000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
const buildLog = (built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Could not|not found|failed|Cannot/i.test(l));
check('the app builds', built.status === 0, buildLog.join('\n') || 'npm run build failed. Run it in the terminal to read the full message.');

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const sourceFiles = walk('src').filter((f) => /\.(jsx?|css)$/.test(f));
const read = (f) => readFileSync(f, 'utf8');
check('there are no inline style props', !sourceFiles.some((f) => /\.jsx?$/.test(f) && /style\s*=\s*\{/.test(read(f))), 'Remove style={{ ... }}. Use className and put the styles in a stylesheet.');
check('JSX uses className, never class', !sourceFiles.some((f) => /\.jsx$/.test(f) && /\sclass\s*=/.test(read(f))), 'In JSX the attribute is className, because class is a reserved word in JavaScript.');
