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

check('no "any" types', !/:\s*any\b|<any>|\bas any\b|\bany\[\]/.test(code), 'Replace every any with a type parameter like T.');
check('no @ts-expect-error or @ts-ignore left', !/@ts-(expect-error|ignore|nocheck)/.test(source), 'Delete the comments.');

// If these were still "any", the @ts-expect-error lines would be unused and tsc would complain.
typeTest('firstOf keeps the item type', [
  'const a: number | undefined = m.firstOf([1, 2]);',
  '// @ts-expect-error a number list gives a number, not a string',
  'const b: string | undefined = m.firstOf([1, 2]);',
  'export { a, b };',
].join('\n'));
typeTest('groupBy keeps the item type', [
  "const g = m.groupBy([{ n: 1 }], () => 'a' as const);",
  'const n: number | undefined = g.a?.[0]?.n;',
  '// @ts-expect-error the items have no "title"',
  'g.a?.[0]?.title;',
  'export { n };',
].join('\n'));
typeTest('mapResult changes the value type', [
  'const r = m.mapResult(m.parsePrice("2"), (n) => String(n));',
  'if (r.ok) {',
  '  const s: string = r.value;',
  '  // @ts-expect-error the value is now a string',
  '  const n: number = r.value;',
  '  void s; void n;',
  '}',
].join('\n'));

t('firstOf gives the first item, or undefined', (m) => m.firstOf([3, 4]) === 3 && m.firstOf([]) === undefined);
t('groupBy groups by the key callback', (m) => same(m.groupBy(['apple', 'avocado', 'bread'], (s) => s[0]), { a: ['apple', 'avocado'], b: ['bread'] }));
t('parsePrice reads a price', (m) => same(m.parsePrice('$4.50'), { ok: true, value: 4.5 }) && same(m.parsePrice('1,200'), { ok: true, value: 1200 }));
t('parsePrice reports a failure', (m) => {
  const r = m.parsePrice('free');
  return r.ok === false && typeof r.error === 'string' && r.error.length > 0;
});
t('mapResult maps a good result and passes a failure through', (m) => {
  const bad = { ok: false, error: 'nope' };
  return same(m.mapResult({ ok: true, value: 10 }, (n) => n * 2), { ok: true, value: 20 }) && same(m.mapResult(bad, (n) => n * 2), bad);
});
