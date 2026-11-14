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

if (!existsSync('node_modules/lighthouse') || !existsSync('node_modules/playwright')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { chromium } = await import('playwright');
const { serve } = await import(pathToFileURL(path.resolve('serve.mjs')).href);
const { lighthouseReport } = await import(pathToFileURL(path.resolve('lib.mjs')).href);

/* ---- what the HTML says ---- */
const html = read('site/index.html');
const tag = (re) => (html.match(re) ?? [''])[0];
const attr = (t, name) => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(t)?.slice(2).find((v) => v !== undefined);
const has = (t, name) => new RegExp(`\\s${name}(\\s|=|>|/)`, 'i').test(t);
const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
const hero = imgs.find((i) => /hero\.jpg/.test(i)) ?? '';

check(
  'the hero image has high priority and is not lazy',
  !!hero && attr(hero, 'fetchpriority') === 'high' && attr(hero, 'loading') !== 'lazy',
  'On the hero <img>, remove loading="lazy" and add fetchpriority="high".',
);
const preload = (html.match(/<link\b[^>]*>/gi) ?? []).find((l) => /rel\s*=\s*["']preload["']/.test(l) && /as\s*=\s*["']image["']/.test(l) && /hero\.jpg/.test(l));
check('the hero image is preloaded', !!preload, 'Add <link rel="preload" as="image" href="/hero.jpg" fetchpriority="high" /> inside <head>.');
const unsized = imgs.filter((i) => !(parseInt(attr(i, 'width') ?? '', 10) > 0 && parseInt(attr(i, 'height') ?? '', 10) > 0));
check('every image has width and height', imgs.length >= 2 && unsized.length === 0, `${unsized.length} image(s) have no width and height. Use the file's real pixel size.`);
const widget = tag(/<script\b[^>]*widget\.js[^>]*>/i);
check('the widget script does not block rendering', !!widget && (has(widget, 'defer') || has(widget, 'async') || /type\s*=\s*["']module["']/.test(widget)), 'Add defer to the <script src="/widget.js"> tag.');

/* ---- load the page in a real browser, with the images arriving late, and measure it ---- */
const server = await serve('site', 0, { '/hero.jpg': 400, '/work.jpg': 250 });
const browser = await chromium.launch();
let m = null;
let widgetDone = false;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.addInitScript(() => {
    window.__m = { cls: 0, long: [] };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__m.long.push(e.duration);
    }).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(server.url);
  widgetDone = await page.waitForFunction(() => window.__widgetReady === true, null, { timeout: 5000 }).then(() => true, () => false);
  await page.waitForTimeout(1200); // let the late images land
  m = await page.evaluate(() => window.__m);
} finally {
  await browser.close();
}
const blocking = (m?.long ?? []).reduce((sum, d) => sum + Math.max(0, d - 50), 0);
check('layout shift is under 0.05', !!m && m.cls < 0.05, `CLS was ${m?.cls.toFixed(3)}. Images without width and height push the page down when they arrive.`);
check('the widget still finishes', widgetDone, 'window.__widgetReady never became true. The widget must still complete its work.');
check('blocking time is under 100ms', !!m && blocking < 100, `The main thread was blocked for ${Math.round(blocking)}ms beyond the 50ms-per-task allowance (${(m?.long ?? []).map(Math.round).join(', ')}ms tasks). Slice the work.`);

/* ---- Lighthouse's structure audits, on the same page ---- */
let lhr = null;
let lhError = '';
try {
  lhr = await lighthouseReport(server.url);
} catch (e) {
  lhError = e.message;
}
await server.close();
const blockers = (lhr?.audits?.['render-blocking-insight']?.details?.items ?? []).map((it) => it.url);
const unsizedScore = lhr?.audits?.['unsized-images']?.score;
const lhBad = [unsizedScore !== null && unsizedScore !== undefined && unsizedScore < 1 && 'unsized images', blockers.some((u) => /widget\.js/.test(u)) && 'widget.js blocking rendering'].filter(Boolean);
// The stylesheet is meant to block rendering, so it isn't a fault.
check('lighthouse finds nothing to fix', !!lhr && lhBad.length === 0, lhr ? `Lighthouse still flags: ${lhBad.join(', ')}.` : `Lighthouse didn't run: ${lhError}`);
