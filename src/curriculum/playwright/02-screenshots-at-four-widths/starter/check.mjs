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

import { createHash } from 'node:crypto';

rmSync('shots', { recursive: true, force: true });
rmSync(HITS, { force: true });
const ran = runNode(['shots.mjs']);
check('shots.mjs runs', ran.status === 0, tail(ran));

const WIDTHS = [375, 768, 1280, 1920];
const file = (w) => `shots/home-${w}.png`;
/** Reads width and height from a PNG's header, or null if it isn't a PNG. */
const size = (f) => {
  if (!existsSync(f)) return null;
  const b = readFileSync(f);
  if (b.length < 24 || b.subarray(1, 4).toString() !== 'PNG') return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), hash: createHash('sha1').update(b).digest('hex') };
};
const sizes = Object.fromEntries(WIDTHS.map((w) => [w, size(file(w))]));
const missing = WIDTHS.filter((w) => !sizes[w]);
check('a png exists for each width', missing.length === 0, `Missing or not a PNG: ${missing.map(file).join(', ')}`);
const wrong = WIDTHS.filter((w) => sizes[w] && sizes[w].width !== w);
check('each screenshot is as wide as its viewport', missing.length === 0 && wrong.length === 0, `Wrong width: ${wrong.map((w) => `${w} is ${sizes[w].width}px`).join(', ')}`);
const short = WIDTHS.filter((w) => sizes[w] && sizes[w].height <= 900);
check('the shots are full page', missing.length === 0 && short.length === 0, `Only the window was captured at: ${short.join(', ')}. Add fullPage: true.`);
check('each width is different', missing.length === 0 && new Set(WIDTHS.map((w) => sizes[w].hash)).size === 4, 'Two of the screenshots are identical, so the viewport probably isn\'t being resized between shots.');

const src = codeOf(read('shots.mjs'));
check('tracking requests are blocked', hits() === 0 && /blockAnalytics\(/.test(src), hits() ? `${hits()} tracking request(s) got through. Call await blockAnalytics(page) before page.goto.` : 'Call await blockAnalytics(page) before page.goto.');
check('one browser for all four widths', (src.match(/\.launch\(/g) ?? []).length === 1 && (src.match(/\.newPage\(/g) ?? []).length === 1 && /setViewportSize\(/.test(src) && /browser\.close\(\)/.test(src), 'Launch one browser, open one page, change its size with setViewportSize, and close the browser at the end.');
