// Check my work: runs the tests in tests/ (open them, they're short and readable), then looks at the project files.
// Every check prints PASS or FAIL.
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

if (!existsSync('node_modules/@electric-sql/pglite') || !existsSync('node_modules/vitest')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

/* ---- 1. the tests: each test title prints as one PASS or FAIL line ---- */
const resultFile = path.join(os.tmpdir(), `bs-dash-${process.pid}.json`);
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

/* ---- 2. the project files ---- */
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const gitignore = read('.gitignore');
check('.env.example lists the keys with fake values, and .env is git-ignored', /^SUPABASE_URL=\S+/m.test(read('.env.example')) && /^SUPABASE_ANON_KEY=\S+/m.test(read('.env.example')) && !/eyJ[A-Za-z0-9_-]{10,}/.test(read('.env.example')) && /^\.env$/m.test(gitignore), 'Keep .env.example with placeholder values only (no real key), and keep .env in .gitignore.');
const supa = read('src/supabase.js');
check('the Supabase client reads its keys from the environment', /process\.env\.SUPABASE_URL/.test(supa) && /process\.env\.SUPABASE_ANON_KEY/.test(supa) && !/https:\/\/[a-z0-9-]+\.supabase\.co/i.test(supa) && !/eyJ[A-Za-z0-9_-]{10,}/.test(supa), 'No URL or key in the code. Read both from process.env.');
const sql = walk('db/migrations').map(read).join('\n');
check('the queries use parameters, never string-built SQL', !/\$\{/.test(read('src/queries.js').replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')) && /\$1/.test(read('src/queries.js')), 'Pass values as $1, $2 with an array, and don\'t use ${...} inside the SQL.');
check('money is stored as integer cents, not floating point', /revenue_cents\s+integer/i.test(sql) && !/\b(float|real|double precision)\b/i.test(sql), 'Use integer cents for money.');
