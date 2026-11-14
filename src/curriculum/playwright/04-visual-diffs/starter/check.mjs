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
const { PNG } = await import('pngjs');

let compareImages = null;
let loadError = '';
try {
  compareImages = (await import(pathToFileURL(path.resolve('diff.mjs')).href)).compareImages;
} catch (e) {
  loadError = e.message;
}

/** Makes a solid-colour PNG, with an optional square of another colour in the corner. */
function picture(width, height, rgb = [255, 255, 255], square = 0, squareRgb = [0, 0, 0]) {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = x < square && y < square ? squareRgb : rgb;
      png.data.set([r, g, b, 255], (y * width + x) * 4);
    }
  }
  return PNG.sync.write(png);
}
const C = (name, fn, why) => {
  try {
    check(name, !!compareImages && fn(compareImages) === true, compareImages ? why : `diff.mjs didn't load: ${loadError}`);
  } catch (e) {
    fail(name, e.message);
  }
};
const white = picture(100, 100);
C('identical images have no differences', (f) => { const r = f(white, white); return r.diffPixels === 0 && r.ratio === 0 && r.width === 100 && r.height === 100; }, 'Two identical pictures should give diffPixels 0 and ratio 0, with width and height filled in.');
C('it counts changed pixels and the ratio', (f) => { const r = f(white, picture(100, 100, [255, 255, 255], 10)); return r.diffPixels === 100 && Math.abs(r.ratio - 0.01) < 1e-9; }, 'A 10 by 10 black square on a 100 by 100 picture is 100 pixels, a ratio of 0.01.');
C('the threshold ignores tiny differences', (f) => { const faint = picture(100, 100, [252, 252, 252]); return f(white, faint).diffPixels === 0 && f(white, faint, { threshold: 0 }).diffPixels > 0; }, 'A shade nobody can see (255 vs 252) should count as no difference with the default threshold, but count if you pass { threshold: 0 }. Pass the threshold on to pixelmatch.');
C('different sizes are reported', (f) => f(white, picture(100, 120)).sizeMismatch === true, 'Different sizes should return { sizeMismatch: true } rather than throwing.');
C('it returns a diff png', (f) => { const r = f(white, picture(100, 100, [255, 255, 255], 10)); const out = PNG.sync.read(r.diffPng); return Buffer.isBuffer(r.diffPng) && out.width === 100 && out.height === 100; }, 'diffPng should be a Buffer holding a PNG as big as the inputs: PNG.sync.write(out).');

/* ---- run visual-diff.mjs for real, three times, one browser at a time ---- */
rmSync('diff.png', { force: true });
rmSync('report.json', { force: true });
rmSync(HITS, { force: true });
const run = (a, b) => {
  rmSync('report.json', { force: true });
  const r = runNode(['visual-diff.mjs', a, b]);
  let report = null;
  try {
    report = JSON.parse(read('report.json'));
  } catch {
    /* reported by the checks */
  }
  return { r, report, diffExists: existsSync('diff.png') };
};
const changed = run('pages/before.html', 'pages/after.html');
const diffMade = changed.diffExists;
const same = run('pages/before.html', 'pages/before.html');
const almost = run('pages/before.html', 'pages/almost.html');
const V = (name, ok, why, ...runs) => check(name, runs.every((x) => x.report) && ok, runs.find((x) => !x.report) ? `visual-diff.mjs didn't finish.\n${tail(runs.find((x) => !x.report).r)}` : why);
V('a real change is called changed', changed.report?.verdict === 'changed' && changed.report.diffPixels > 1000, `before vs after said "${changed.report?.verdict}" with ${changed.report?.diffPixels} different pixels. Use ratio > MAX_RATIO.`, changed);
V('no visible change is called same', same.report?.verdict === 'same' && almost.report?.verdict === 'same' && almost.report.diffPixels === 0, `before vs before said "${same.report?.verdict}", before vs almost said "${almost.report?.verdict}" (${almost.report?.diffPixels} pixels). The invisible shade must not count.`, same, almost);
const src = codeOf(read('visual-diff.mjs'));
check('it writes diff.png and blocks tracking', diffMade && hits() === 0 && /blockAnalytics\(/.test(src) && /animations\s*:\s*['"]disabled['"]/.test(src), hits() ? `${hits()} tracking request(s) got through. Call await blockAnalytics(page).` : 'Write diff.png, call blockAnalytics(page), and take screenshots with animations: "disabled".');
