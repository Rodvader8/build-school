// Check my work: runs your project and inspects what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
/** Source code without comments, so a comment can't fool a check. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');


if (!existsSync('node_modules/playwright')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { chromium } = await import('playwright');
if (!existsSync(chromium.executablePath())) {
  fail('the browser is installed', 'Playwright needs its Chromium. Run "npx playwright install chromium" once (it needs the internet), then try again.');
  process.exit(0);
}
const HITS = 'analytics-hits.log';
/** How many tracking requests reached the pretend analytics service. */
const hits = () => read(HITS).split('\n').filter(Boolean).length;
/** Runs a script of the student's with node and returns what it printed. Only ever one at a time. */
const runNode = (args, env = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', timeout: 120000, env: { ...process.env, ...env } });
const tail = (r) => (r.stdout + r.stderr).trim().split('\n').slice(-5).join('\n');

const config = codeOf(read('playwright.config.mjs'));
const spec = codeOf(readdirSync('tests').filter((f) => /\.(spec|test)\.m?[jt]s$/.test(f)).map((f) => read(path.join('tests', f))).join('\n'));

check('the config runs one test at a time', /workers\s*:\s*1\b/.test(config) && /fullyParallel\s*:\s*false/.test(config), 'Add workers: 1 and fullyParallel: false to defineConfig({...}). One browser at a time, always.');
check('the config starts the server', /webServer\s*:/.test(config) && /start-server\.mjs/.test(config) && /baseURL\s*:/.test(config), 'Add webServer: { command: "node start-server.mjs", url: "http://127.0.0.1:4891/", reuseExistingServer: false } and use: { baseURL: "http://127.0.0.1:4891" }.');

/** Runs the whole test suite once (one worker, one browser) and returns Playwright's own numbers. */
function runTests(mut) {
  const env = { ...process.env, ...(mut ? { MUT: mut } : {}) };
  if (!mut) delete env.MUT;
  const r = spawnSync('npx', ['--no-install', 'playwright', 'test', '--reporter=json', '--workers=1'], { encoding: 'utf8', timeout: 180000, env });
  try {
    const { stats } = JSON.parse(r.stdout);
    return { passed: stats.expected, failed: stats.unexpected + stats.flaky, skipped: stats.skipped, log: '' };
  } catch {
    return { passed: 0, failed: 1, skipped: 0, log: tail(r) };
  }
}

rmSync(HITS, { force: true });
rmSync('test-results', { recursive: true, force: true });
const good = runTests();
const baselineOk = good.passed >= 4 && good.failed === 0 && good.skipped === 0;
check('four or more tests pass on the good page', baselineOk, good.log || `${good.passed} passed, ${good.failed} failed, ${good.skipped} skipped. Run npx playwright test in the terminal to see why.`);
check('tracking is blocked in the tests', baselineOk && hits() === 0 && /\.route\(/.test(spec) && /\.abort\(\)/.test(spec), hits() ? `${hits()} tracking request(s) got through. Block "**/analytics/**" in a test.beforeEach.` : 'Add test.beforeEach with page.route("**/analytics/**", (route) => route.abort()).');

const broken = (mut, name, what) => {
  const r = runTests(mut);
  check(name, baselineOk && r.failed >= 1, baselineOk ? `With ${what}, all ${r.passed} of your tests still passed. Add an assertion that would notice.` : 'Get the tests passing on the good page first.');
};
broken('menu', 'the tests catch a broken menu', 'a menu that doesn\'t open');
broken('noerror', 'the tests catch a missing error message', 'the error message never appearing');
broken('nosuccess', 'the tests catch a missing thank-you message', 'the thank-you never appearing');
