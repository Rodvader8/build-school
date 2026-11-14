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

check('Status is a union of strings, not an enum', !/\benum\b/.test(code) && /\btype\s+Status\s*=/.test(code), 'Replace the enum with a list and "type Status = ...".');
check('Booking has an optional note', /interface\s+Booking\b[^}]*\bnote\?\s*:\s*string/.test(code), 'Add note?: string to the Booking interface.');
check('VipBooking extends Booking', /interface\s+VipBooking\s+extends\s+Booking\b[^}]*\btable\s*:\s*string/.test(code), 'interface VipBooking extends Booking { table: string }');
check('Summary is a type alias', /\btype\s+Summary\s*=/.test(code), 'Add: type Summary = { ... }');

const bookings = [
  { id: 1, name: 'Ana', guests: 4, status: 'confirmed' },
  { id: 2, name: 'Ben', guests: 2, status: 'pending' },
  { id: 3, name: 'Cy', guests: 6, status: 'cancelled' },
  { id: 4, name: 'Di', guests: 3, status: 'confirmed', note: 'high chair' },
];
t('the three statuses exist', (m) => same([...(m.STATUSES ?? [])].sort(), ['cancelled', 'confirmed', 'pending']));
t('summarise counts bookings and guests', (m) => {
  const s = m.summarise(bookings);
  return s.total === 4 && s.guests === 9 && same(s.byStatus, { pending: 1, confirmed: 2, cancelled: 1 });
});
t('describe handles plain and VIP bookings', (m) =>
  m.describe(bookings[0]) === 'Ana for 4' && m.describe({ ...bookings[0], table: '2' }) === 'Ana for 4 at table 2');
