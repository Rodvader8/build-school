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

import { pathToFileURL } from 'node:url';
const { serve } = await import(pathToFileURL(path.resolve('serve.mjs')).href);

const src = codeOf(read('smooth-scroll.mjs'));
let smoothScroll = null;
let loadError = '';
try {
  smoothScroll = (await import(pathToFileURL(path.resolve('smooth-scroll.mjs')).href)).smoothScroll;
} catch (e) {
  loadError = e.message;
}
check('smoothScroll loads', typeof smoothScroll === 'function', loadError || 'smooth-scroll.mjs should export an async function smoothScroll(page, { to, duration }).');
check(
  'it uses requestAnimationFrame',
  /requestAnimationFrame\s*\(/.test(src) && !/behavior\s*:\s*['"]smooth['"]/.test(src) && !/scrollIntoView/.test(src) && !/waitForTimeout/.test(src) && !/setTimeout/.test(src),
  'Drive the scroll with requestAnimationFrame inside page.evaluate. No behavior: "smooth", scrollIntoView, setTimeout or waitForTimeout.',
);
if (typeof smoothScroll !== 'function') process.exit(0);

/* ---- run it in a real browser and record the scroll position on every frame ---- */
const TARGET = 2400;
const DURATION = 1600;
const server = await serve('site');
const browser = await chromium.launch();
let trace = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.route('**/analytics/**', (r) => r.abort());
  await page.goto(server.url);
  await page.evaluate(() => {
    window.__trace = [];
    const tick = () => {
      window.__trace.push([performance.now(), window.scrollY]);
      window.__rec = requestAnimationFrame(tick);
    };
    tick();
  });
  try {
    await smoothScroll(page, { to: TARGET, duration: DURATION });
  } catch (e) {
    fail('smoothScroll runs', e.message);
  }
  await page.waitForTimeout(150);
  trace = await page.evaluate(() => {
    cancelAnimationFrame(window.__rec);
    return window.__trace;
  });
} finally {
  await browser.close();
  await server.close();
}

/* ---- analyse the trace ---- */
const end = trace.at(-1)?.[1] ?? 0;
const moving = trace.filter(([, y]) => y > 0);
const t0 = moving[0]?.[0] ?? 0;
const tEnd = (trace.find(([, y]) => Math.abs(y - end) < 0.5 && y > 0) ?? [t0])[0];
const elapsed = tEnd - t0;
const distinct = new Set(trace.map(([, y]) => Math.round(y))).size;
const backwards = trace.some(([, y], i) => i > 0 && y < trace[i - 1][1] - 0.5);

/** Position at time t (ms) by linear interpolation between recorded frames. */
const at = (t) => {
  const i = trace.findIndex(([ts]) => ts >= t);
  if (i <= 0) return trace[0]?.[1] ?? 0;
  const [ta, ya] = trace[i - 1];
  const [tb, yb] = trace[i];
  return ya + ((yb - ya) * (t - ta)) / (tb - ta || 1);
};
const slices = Array.from({ length: 10 }, (_, i) => (at(t0 + ((i + 1) * elapsed) / 10) - at(t0 + (i * elapsed) / 10)) / (elapsed / 10));
const cruise = slices.slice(2, 8);
const sorted = [...cruise].sort((a, b) => a - b);
const vc = (sorted[2] + sorted[3]) / 2;
const speeds = slices.map((v) => v.toFixed(2)).join(', ');

check('it ends on the target', Math.abs(end - TARGET) <= 2, `It finished at ${Math.round(end)}px, not ${TARGET}px. Clamp t to 1 so the last frame lands exactly on the target.`);
check('it takes about the requested time', elapsed > DURATION * 0.75 && elapsed < DURATION * 1.25, `Asked for ${DURATION}ms, it took about ${Math.round(elapsed)}ms. Work out t from elapsed time: (now - start) / duration.`);
check('it moves on every frame', distinct >= 30, `Only ${distinct} different positions were seen. A smooth scroll changes position on nearly every frame (about 100 of them in 1.6 seconds).`);
check('it never goes backwards', !backwards, 'The scroll position went backwards at some point. progress(t) should only ever increase.');
check('it eases in', vc > 0 && slices[0] < vc * 0.5, `Speed in the first tenth is ${slices[0].toFixed(2)} px/ms against a cruise of ${vc.toFixed(2)}. It should start slowly. Speeds per tenth: ${speeds}`);
check('it cruises at a steady speed', vc > 0 && cruise.every((v) => Math.abs(v - vc) <= vc * 0.2), `The middle should be a steady speed. Speeds per tenth: ${speeds}`);
check('it eases out', vc > 0 && slices[9] < vc * 0.5, `Speed in the last tenth is ${slices[9].toFixed(2)} px/ms against a cruise of ${vc.toFixed(2)}. It should slow down to a stop. Speeds per tenth: ${speeds}`);
