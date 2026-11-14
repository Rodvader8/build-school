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


/* ---- a small semver reader: exact, ^, ~, >=, >, <=, <, and "||" ---- */
const parseV = (s) => s.split('.').map((n) => parseInt(n, 10) || 0).concat([0, 0, 0]).slice(0, 3);
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
function parts(range) {
  return String(range).split('||').map((part) =>
    part.trim().split(/\s+/).flatMap((tok) => {
      const m = /^(\^|~|>=|<=|<|>|=)?v?(\d+(?:\.\d+){0,2})$/.exec(tok);
      if (!m) return [['bad', [0, 0, 0]]];
      const [op = '=', v] = [m[1], m[2]];
      const x = parseV(v);
      if (op === '^') return [['>=', x], ['<', x[0] > 0 ? [x[0] + 1, 0, 0] : x[1] > 0 ? [0, x[1] + 1, 0] : [0, 0, x[2] + 1]]];
      if (op === '~') return [['>=', x], ['<', [x[0], x[1] + 1, 0]]];
      return [[op, x]];
    }),
  );
}
const holds = ([op, v], x) => ({ '>=': cmp(x, v) >= 0, '>': cmp(x, v) > 0, '<=': cmp(x, v) <= 0, '<': cmp(x, v) < 0, '=': cmp(x, v) === 0 }[op] ?? false);
const allows = (range, version) => parts(range).some((p) => p.length > 0 && p.every((c) => holds(c, parseV(version))));
/** The lowest version a range can install, or null when it has no floor (like "<=3.4.1" or "*"). */
function floor(range) {
  const floors = parts(range).map((p) => p.filter(([op]) => ['>=', '>', '='].includes(op)).map(([, v]) => v).sort(cmp).at(-1));
  return floors.some((f) => !f) ? null : floors.sort(cmp)[0];
}
/** True when the range can install the fixed version AND never installs anything older. */
const reachesFixFrom = (range, fixed) => typeof range === 'string' && allows(range, fixed) && !!floor(range) && cmp(floor(range), parseV(fixed)) >= 0;

let pkg = null;
let readError = '';
try {
  pkg = JSON.parse(read('package.json'));
} catch (e) {
  readError = e.message;
}
const deps = { ...(pkg?.devDependencies ?? {}), ...(pkg?.dependencies ?? {}) };
const report = JSON.parse(read('audit.json') || '{}');
const fixedIn = (name) => report.vulnerabilities?.[name]?.fixAvailable?.version;

const P = (name, ok, why) => check(name, !!pkg && ok, pkg ? why : `package.json isn't valid JSON: ${readError}`);
P(
  'tiny-markdown can only install the fixed version or later',
  reachesFixFrom(deps['tiny-markdown'], fixedIn('tiny-markdown')),
  `The range "${deps['tiny-markdown']}" can still install a vulnerable version. The fix is ${fixedIn('tiny-markdown')}, so the range should start there: ^${fixedIn('tiny-markdown')}.`,
);
P(
  'zip-sanitiser can reach the fixed version',
  reachesFixFrom(deps['zip-sanitiser'], fixedIn('zip-sanitiser')),
  `The range "${deps['zip-sanitiser']}" can't install ${fixedIn('zip-sanitiser')}. A ~ range stops at the next minor, so it needs widening.`,
);
const override = pkg?.overrides?.['glob-match'];
P(
  'the glob-match override no longer blocks the fix',
  reachesFixFrom(override, fixedIn('glob-match')),
  `The override "${override}" ${override ? 'still allows the vulnerable versions or blocks the fix' : 'is gone, so nothing forces the fix'}. Use a floor like ^${fixedIn('glob-match')}.`,
);
const notes = read('audit-notes.md').split('\n').find((l) => l.includes('slugify-au')) ?? '';
P(
  'the unfixable finding is written down',
  !!deps['slugify-au'] && notes.length >= 60 && /(no fix|not fixed|accept|monitor|low|risk|review|look again|short|trusted)/i.test(notes),
  'Keep slugify-au in package.json and add a line to audit-notes.md that names it and gives your reason (at least a sentence).',
);
const originals = ['slugify-au', 'tiny-markdown', 'zip-sanitiser', 'build-toolkit'];
P(
  'no dependency was deleted or wildcarded',
  originals.every((n) => deps[n]) && Object.values(deps).every((r) => !/^(\*|latest|x|)$/.test(r) && parts(r).every((p) => p.every(([op]) => op !== 'bad'))),
  'Every dependency should still be there, with a real range. Fix the version, don\'t delete the package or use "*" or "latest".',
);
P('there is an audit script', /npm audit/.test(pkg?.scripts?.audit ?? '') && /--audit-level[= ](high|critical)/.test(pkg?.scripts?.audit ?? ''), 'Add "audit": "npm audit --audit-level=high" under "scripts".');
