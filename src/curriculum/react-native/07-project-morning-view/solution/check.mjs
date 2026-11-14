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

/* ---- 3. how the screen is built ---- */
const screenSource = read('app/index.jsx');
check('the arrivals are a FlatList keyed by booking reference', /<FlatList[\s>]/.test(screenSource) && /keyExtractor=\{\(\s*(\w+)\s*\)\s*=>\s*\1\.ref\s*\}/.test(screenSource), 'Use <FlatList data={shown} keyExtractor={(item) => item.ref} ... /> for the arrivals.');
check('every component keeps its styles in StyleSheet.create, with none in the JSX', jsxFiles.every((f) => !/style=\{\{/.test(read(f)) && !/style=\{\[[^\]]*\{/.test(read(f))) && ['app/index.jsx', 'components/OccupancyCard.jsx', 'components/ArrivalRow.jsx'].every((f) => /StyleSheet\.create/.test(read(f))), 'Name each style in StyleSheet.create and use style={styles.name}. No style={{ ... }} in the JSX.');
check('colours come from theme.js', ['app/index.jsx', 'components/OccupancyCard.jsx', 'components/ArrivalRow.jsx'].every((f) => !/#[0-9a-fA-F]{3,8}\b/.test(read(f))), 'Use colors.ink, colors.accent and friends from theme.js rather than hex codes.');
check('the app uses expo-router with a Stack layout', /<Stack[\s>]/.test(read('app/_layout.jsx')) && json('package.json').main === 'expo-router/entry', 'app/_layout.jsx should render a Stack, and package.json main should be expo-router/entry.');
check('the exported app contains the morning view', exportOk && bundle.includes('Good morning') && bundle.includes('rooms occupied') && bundle.includes('No early arrivals'), 'The export should include the heading, the occupancy sentence and the empty message.');
