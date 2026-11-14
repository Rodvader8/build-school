// Check my work: reads your workflow, then runs the same steps here. No GitHub account needed.
// Every check prints PASS or FAIL. Open this file if you're curious.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};

if (!existsSync('node_modules/yaml')) {
  out('FAIL dependencies are installed');
  out('  Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { parse } = await import('yaml');

/* ---- the workflow ---- */
const file = '.github/workflows/ci.yml';
let wf = null;
let yamlError = existsSync(file) ? '' : `${file} is missing.`;
if (!yamlError) {
  try {
    wf = parse(readFileSync(file, 'utf8'));
    if (!wf || typeof wf !== 'object') yamlError = 'The file parsed, but it is empty or not a mapping.';
  } catch (e) {
    yamlError = e.message.split('\n')[0];
  }
}
check('the workflow file is valid YAML with a name', !yamlError && typeof wf.name === 'string' && wf.name.trim() !== '', yamlError || 'Give the workflow a name: at the top of the file.');

const on = wf?.on ?? {};
const triggers = Array.isArray(on) ? on : typeof on === 'string' ? [on] : Object.keys(on);
const pushBranches = !Array.isArray(on) && typeof on === 'object' ? on.push?.branches : undefined;
check(
  'it runs on every push to main and on every pull request',
  triggers.includes('push') && triggers.includes('pull_request') && (pushBranches === undefined || pushBranches.includes('main')),
  'Add an "on:" block with push (branches: [main]) and pull_request.',
);

const jobs = Object.values(wf?.jobs ?? {});
const job = jobs[0];
const steps = job?.steps ?? [];
check('the job runs on ubuntu-latest, with a timeout', jobs.length >= 1 && job['runs-on'] === 'ubuntu-latest' && Number(job['timeout-minutes']) > 0 && Number(job['timeout-minutes']) <= 30, 'Set runs-on: ubuntu-latest and timeout-minutes (30 at most). A hung job should never run for six hours.');

const uses = steps.filter((s) => s.uses);
const checkout = uses.find((s) => s.uses.startsWith('actions/checkout@'));
const setup = uses.find((s) => s.uses.startsWith('actions/setup-node@'));
check('it checks out the code and sets up Node with npm caching', !!checkout && !!setup && !!setup.with?.['node-version'] && setup.with?.cache === 'npm', 'Use actions/checkout, then actions/setup-node with a node-version and cache: npm.');

const commands = steps.filter((s) => s.run).flatMap((s) => String(s.run).split('\n').map((l) => l.trim()).filter(Boolean));
const at = (re) => commands.findIndex((c) => re.test(c));
const [iCi, iLint, iTest, iBuild] = [at(/^npm ci\b/), at(/^npm run lint\b/), at(/^npm (run )?test\b/), at(/^npm run build\b/)];
check('it installs with npm ci, not npm install', iCi !== -1 && at(/^npm (install|i)\b/) === -1, 'npm ci installs exactly what package-lock.json says and fails if they disagree. npm install can quietly change versions.');
check('it runs lint, test and build, in that order, after the install', iCi !== -1 && iCi < iLint && iLint < iTest && iTest < iBuild, 'After npm ci: npm run lint, then npm test, then npm run build. Cheapest check first.');

const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts ?? {};
const missing = commands.filter((c) => /^npm /.test(c)).map((c) => /^npm run (\S+)/.exec(c)?.[1] ?? (/^npm (test|ci|install|i)\b/.test(c) ? (/^npm test/.test(c) ? 'test' : null) : null)).filter((n) => n && !scripts[n]);
check('every npm script the workflow calls exists in package.json', commands.length > 0 && missing.length === 0, `package.json has no script called "${missing[0]}".`);

const unpinned = uses.filter((s) => !/@(v?\d[\w.]*|[0-9a-f]{40})$/.test(s.uses));
check('actions are pinned to a version, never @main or @master', uses.length > 0 && unpinned.length === 0, uses.length === 0 ? 'The workflow needs actions/checkout and actions/setup-node, each pinned to a version.' : `Pin ${unpinned[0]?.uses} to a version such as @v4. A moving branch can change under you.`);
check('permissions are read-only', wf?.permissions?.contents === 'read' && Object.values(wf.permissions).every((v) => v === 'read' || v === 'none'), 'Add "permissions: contents: read" at the top level. Least privilege: the job can read the code and nothing else.');
check('a new push cancels the run it replaces', !!wf?.concurrency?.group && wf.concurrency['cancel-in-progress'] === true, 'Add a concurrency block with a group (it can use github.ref) and cancel-in-progress: true.');

/* ---- the same steps, run here ---- */
check('package-lock.json is there for npm ci', existsSync('package-lock.json'), 'Run "npm install" once so package-lock.json exists, and commit it.');
const run = (args) => spawnSync('npm', args, { encoding: 'utf8', timeout: 120000, env: { ...process.env, CI: 'true', NO_COLOR: '1', FORCE_COLOR: '0' } });
const tail = (r) => (r.stdout + r.stderr).split('\n').filter((l) => /\S/.test(l) && !/^>|npm (error|ERR)/.test(l)).slice(0, 5).join('\n');
const lint = run(['run', 'lint']);
check('lint passes', lint.status === 0, tail(lint));
const test = run(['test']);
check('the tests pass', test.status === 0, tail(test) || 'npm test failed.');
const build = run(['run', 'build']);
check('the build passes and makes dist/', build.status === 0 && existsSync('dist/tally.js'), tail(build));
const all = run(['run', 'ci']);
check('npm run ci passes, so the workflow will too', all.status === 0, tail(all));
