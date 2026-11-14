// Check my work: type-checks with tsc, then loads main.ts and tests what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));

if (!existsSync('node_modules/typescript')) {
  fail('typescript is installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

const source = readFileSync('main.ts', 'utf8');
const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1'); // without comments

const tsc = () => spawnSync('npx', ['--no-install', 'tsc', '--noEmit'], { encoding: 'utf8' });
const compiled = tsc();
check('types check cleanly', compiled.status === 0, compiled.stdout + compiled.stderr);

/** Type-level test: writes a throwaway file, asks tsc about it, then deletes it. Passes when tsc has no complaint about it. */
function typeTest(name, snippet, header = "import * as m from './main.ts';\n") {
  writeFileSync('zz-typetest.ts', header + snippet);
  const r = tsc();
  rmSync('zz-typetest.ts', { force: true });
  const mine = (r.stdout + r.stderr).split('\n').filter((l) => l.startsWith('zz-typetest.ts'));
  check(name, mine.length === 0, mine.join('\n'));
}

// Load the student's file with its demo output muted.
let mod = null;
let importError = '';
console.log = () => {};
try {
  mod = await import('./main.ts');
} catch (e) {
  importError = e.message.split('\n')[0];
}
console.log = out;

/** Runs a behaviour check against the loaded module. A thrown error is a FAIL with its message. */
const t = (name, fn) => {
  try {
    if (!mod) throw new Error(importError || 'main.ts did not load');
    check(name, fn(mod) === true, 'It ran, but gave a different answer from the one expected.');
  } catch (e) {
    fail(name, e.message);
  }
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

check('no @ts-expect-error or @ts-ignore left', !/@ts-(expect-error|ignore|nocheck)/.test(source), 'Fix each hidden mistake, then delete its comment.');
check('palette uses satisfies Record<Region, string>', /\}\s*satisfies\s+Record<Region,\s*string>/.test(code), 'End the palette object with: satisfies Record<Region, string>');

typeTest('totalsByRegion returns a Record<Region, number>', 'const r: Record<m.Region, number> = m.totalsByRegion(m.sales);\nexport { r };');
typeTest('topRegion returns a Region, not just any string', 'const r: m.Region = m.topRegion(m.totalsByRegion(m.sales));\nexport { r };');

t('sales rows were fixed, not deleted', (m) => m.sales.length === 9 && m.sales.every((r) => m.REGIONS.includes(r.region) && typeof r.revenue === 'number'));
t('targets has all three regions', (m) => same(m.targets, { north: 4500, south: 3300, west: 3000 }));
t('totalsByRegion adds up the revenue', (m) => same(m.totalsByRegion(m.sales), { north: 13950, south: 9930, west: 9010 }));
t('topRegion picks the biggest', (m) => m.topRegion({ north: 1, south: 9, west: 4 }) === 'south');
