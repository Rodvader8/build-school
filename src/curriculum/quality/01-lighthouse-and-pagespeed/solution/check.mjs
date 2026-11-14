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


import { pathToFileURL } from 'node:url';

if (!existsSync('node_modules/lighthouse')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

/* ---- median(): the maths ---- */
let median = null;
let loadError = '';
try {
  median = (await import(pathToFileURL(path.resolve('median.mjs')).href)).median;
} catch (e) {
  loadError = e.message;
}
const M = (name, fn, why) => {
  try {
    check(name, !!median && fn(median) === true, median ? why : `median.mjs didn't load: ${loadError}`);
  } catch (e) {
    fail(name, e.message);
  }
};
M('median of an odd list', (f) => f([9, 1, 5]) === 5 && f([7]) === 7, 'median([9, 1, 5]) should be 5: sort first, then take the middle.');
M('median of an even list', (f) => f([4, 1, 3, 2]) === 2.5 && f([10, 20]) === 15, 'median([4, 1, 3, 2]) should be 2.5, the average of 2 and 3.');
M('median sorts as numbers and does not change the list', (f) => {
  const list = [100, 9, 10];
  return f(list) === 10 && list.join() === '100,9,10';
}, 'Sort a copy with (a, b) => a - b. Plain sort() orders numbers as text, and sorting the original changes your caller\'s list.');

/* ---- measure.mjs: run it for real and read what it wrote ---- */
rmSync('report.json', { force: true });
const ran = spawnSync(process.execPath, ['measure.mjs'], { encoding: 'utf8', timeout: 240000 });
let report = null;
try {
  report = JSON.parse(read('report.json'));
} catch {
  /* handled below */
}
const why = report ? '' : `measure.mjs didn't write a usable report.json.\n${(ran.stdout + ran.stderr).trim().split('\n').slice(-4).join('\n')}`;
const R = (name, ok, msg) => check(name, !!report && ok, report ? msg : why);
const mid = (xs) => { const s = [...xs].sort((a, b) => a - b); const i = Math.floor(s.length / 2); return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };

const runs = report?.runs ?? [];
const sane = runs.every((r) => r.score >= 0 && r.score <= 100 && r.lcp > 0 && r.tbt >= 0 && r.cls >= 0);
R('measure.mjs runs three audits', runs.length === 3 && sane, `report.json has ${runs.length} run(s). Audit three times, one after another, and keep every result in "runs".`);
R(
  'the report quotes the medians',
  runs.length > 0 && ['score', 'lcp', 'tbt', 'cls'].every((k) => report.median?.[k] === mid(runs.map((r) => r[k]))),
  'report.median should hold the median of each number across the runs, not the first run or an average.',
);
const scores = runs.map((r) => r.score);
R('the report shows the spread', runs.length > 0 && report.spread === Math.max(...scores) - Math.min(...scores), 'spread should be the best score minus the worst score.');
const code = codeOf(read('measure.mjs'));
R('it only audits a local page', /^http:\/\/127\.0\.0\.1:\d+\/$/.test(report?.url ?? '') && !/https?:\/\/(?!127\.0\.0\.1|localhost)[\w.-]+\.\w{2,}/.test(code), 'Audit server.url (the local page) and never write a real website address in the script.');
