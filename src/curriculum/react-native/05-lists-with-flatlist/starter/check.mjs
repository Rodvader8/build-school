// Check my work: runs the tests in tests/ (open them, they're short and readable), exports the app for the web
// with `expo export`, then looks inside what it made. Every check prints PASS or FAIL.
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
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1', EXPO_NO_TELEMETRY: '1' };

if (!existsSync('node_modules/expo') || !existsSync('node_modules/vitest')) {
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
const walk = (dir, skip = []) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        if (skip.includes(f)) return [];
        return statSync(p).isDirectory() ? walk(p, skip) : [p];
      })
    : [];
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const json = (f) => {
  try {
    return JSON.parse(read(f));
  } catch {
    return {};
  }
};
// The app's own code: everything except dependencies, build output and the tests.
const sourceFiles = walk('.', ['node_modules', 'dist', '.expo', 'tests']).filter((f) => /\.jsx?$/.test(f));
const jsxFiles = sourceFiles.filter((f) => /\.jsx$/.test(f));

/* ---- 1. the tests: each test title prints as one PASS or FAIL line ---- */
if (existsSync('tests')) {
  const resultFile = path.join(os.tmpdir(), `bs-rn-${process.pid}.json`);
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

/* ---- 2. the web export: the same code a phone runs, bundled for a browser ---- */
rmSync('dist', { recursive: true, force: true });
const exported = spawnSync('npx', ['expo', 'export', '--platform', 'web'], { encoding: 'utf8', timeout: 400000, env });
const exportLog = clean(exported.stdout + exported.stderr).split('\n').filter((l) => /error|Error|Unable|Cannot|not found|failed|Invalid/i.test(l));
const exportOk = exported.status === 0 && existsSync('dist/index.html');
check('the web build exports', exportOk, exportLog.join('\n') || 'expo export failed. Run "npm run export" in the terminal to read the full message.');
const bundle = exportOk ? walk('dist/_expo/static/js').filter((f) => f.endsWith('.js')).map(read).join('\n') : '';

/* ---- 3. how the list is written ---- */
const list = read('components/ArrivalsList.jsx');
check('the list is a FlatList, not a map inside a ScrollView', /<FlatList[\s>]/.test(list) && !/\.map\(/.test(list), 'Use <FlatList data={arrivals} renderItem=... /> instead of arrivals.map(...).');
check('keyExtractor uses the booking reference, never the index', /keyExtractor=\{\(\s*(\w+)\s*\)\s*=>\s*\1\.ref\s*\}/.test(list), 'Add keyExtractor={(item) => item.ref}. The booking reference is what identifies a guest.');
check('rows are separated and an empty list has a message', /ItemSeparatorComponent=/.test(list) && /ListEmptyComponent=/.test(list), 'FlatList has ItemSeparatorComponent and ListEmptyComponent props for exactly this.');
check('the exported app contains the arrivals', exportOk && bundle.includes('Arrivals today') && bundle.includes('No arrivals today'), 'The export should include the arrivals screen and the empty message.');
check('styles stay in StyleSheet.create', jsxFiles.every((f) => !/style=\{\{/.test(read(f))), 'Move any style={{ ... }} into StyleSheet.create.');
