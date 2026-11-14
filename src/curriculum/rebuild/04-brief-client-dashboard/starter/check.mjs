// Check my work: runs the quality gate (gate.mjs) with the dashboard rules switched on, then a few rules particular to this brief.
// Every line prints PASS or FAIL. Open this file if you're curious.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { runGate } from './gate.mjs';

const built = await runGate({ dashboard: true });
if (!built) process.exit(0);

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const walk = (d) => (existsSync(d) ? readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)])) : []);

const components = walk('src').filter((f) => /\.jsx$/.test(f)).map((f) => [f, read(f)]);
const typed = components.flatMap(([f, code]) => (code.match(/\$\s?\d|(?<![#\w.'"])\d{4,}(?![\w])/g) ?? []).map((m) => `${f}: ${m}`));
check('no figures are typed into the components', components.length > 0 && typed.length === 0, `Every number comes from src/data.js. Found: ${typed[0]}`);

const app = components.map(([, c]) => c).join('\n');
check('the page has a skip link and a main landmark', /<main\b/.test(app) && /href=["']#[\w-]+["']/.test(app) && /<h1\b/.test(app), 'Add a skip link at the very top that goes to <main id="...">, and put the content inside <main>.');

const tests = walk('tests').filter((f) => /\.test\.(js|jsx)$/.test(f)).map(read).join('\n');
check('your tests cover sorting, the toggle and the chart', /sort/i.test(tests) && /(aria-pressed|period|toggle)/i.test(tests) && /(chart|figure|role.*img|getByRole\(['"]img)/i.test(tests), 'Your tests should cover three things: sorting the table, choosing a period, and the chart having a name and a table.');
