// The quality gate. The same file is in every Rebuild lesson, and it's what "done" means in Stage 7.
//
//   node gate.mjs        runs the whole gate and prints PASS or FAIL for every rule
//
// It builds your site, serves the built files on a local port, then loads every page in headless Chromium
// (one browser at a time, one page at a time) and measures what it finds. Nothing here touches the internet.
// Open it and read it: every rule is a few lines of plain Node.
//
// What it never does: gate on the Lighthouse PERFORMANCE score or on timings. Those depend on the machine
// they're measured on (CI runners and many laptops have no GPU), so they make a bad pass mark. The structural audits don't:
// "every image has a width and height" is true or false everywhere.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
/** "- /about: one h1 expected, found 2" lines, trimmed so a report stays readable. */
const list = (items, max = 4) => items.slice(0, max).concat(items.length > max ? [`...and ${items.length - max} more`] : []).join('\n');

const WIDTHS = [375, 768, 1280, 1920];
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon' };

/* ---------- the Content-Security-Policy you defined (netlify.toml or _headers) ---------- */
export function findCsp() {
  const toml = read('netlify.toml');
  const t = /Content-Security-Policy\s*=\s*(?:"""([\s\S]*?)"""|"((?:[^"\\]|\\.)*)"|'([^']*)')/i.exec(toml);
  if (t) return { source: 'netlify.toml', value: (t[1] ?? t[2] ?? t[3]).replace(/\\"/g, '"').replace(/\s+/g, ' ').trim() };
  for (const file of ['dist/_headers', 'public/_headers', '_headers']) {
    const h = /^\s*Content-Security-Policy\s*:\s*(.+)$/im.exec(read(file));
    if (h) return { source: file, value: h[1].trim() };
  }
  return null;
}

/* ---------- a tiny static server for dist/, with your CSP on every page ---------- */
function serve(dist, state) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let file = path.join(dist, decodeURIComponent(url.pathname));
    if (!file.startsWith(path.resolve(dist))) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file) && existsSync(file + '.html')) file += '.html';
    if (!existsSync(file)) return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-store' };
    if (state.csp && type.startsWith('text/html')) headers['Content-Security-Policy'] = state.csp;
    let body = readFileSync(file);
    // Lighthouse judges a canonical link against the address it loaded, so for that run the production origin is swapped for the local one.
    if (state.rewrite && type.startsWith('text/html')) body = Buffer.from(body.toString('utf8').split(state.rewrite.from).join(state.rewrite.to));
    res.writeHead(200, headers).end(body);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

/** Every page in dist as a URL path: dist/index.html is "/", dist/about/index.html is "/about/". */
function pagesIn(dist) {
  return walk(dist)
    .filter((f) => f.endsWith('.html') && path.basename(f) !== '404.html')
    .map((f) => '/' + path.relative(dist, f).split(path.sep).join('/').replace(/index\.html$/, ''))
    .sort();
}

const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];

/* ---------- the gate ---------- */
/**
 * Returns true when the site built, so a lesson's own check.mjs knows dist/ is fresh.
 * options.dashboard: also run the dashboard rules (your own tests, keyboard sorting, the chart's text alternative, the period toggle).
 * options.minTests: how many tests of your own a dashboard needs.
 */
export async function runGate(options = {}) {
  const { dashboard = false, minTests = 6 } = options;

  if (!['playwright', 'axe-core', 'lighthouse'].every((m) => existsSync(`node_modules/${m}`))) {
    fail('dependencies are installed', 'Run "npm install" in the terminal first, then run the gate again.');
    return false;
  }

  /* 1. Build. Nothing else means anything until this passes. */
  const built = spawnSync('npm', ['run', 'build'], {
    encoding: 'utf8',
    timeout: 300000,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', NO_COLOR: '1', FORCE_COLOR: '0', CI: '1' },
  });
  const buildLog = (built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Could not|not found|failed|Cannot/i.test(l));
  check('the site builds', built.status === 0, buildLog.join('\n') || 'npm run build failed. Run it in the terminal to read the full message.');
  if (built.status !== 0) return false;

  const dist = path.resolve('dist');
  const pages = pagesIn(dist);
  if (pages.length === 0) {
    fail('the build made at least one page', 'There are no .html files in dist/.');
    return false;
  }

  /* 2. Rules that read files. */
  const srcFiles = walk('src').concat(existsSync('index.html') ? ['index.html'] : []).filter((f) => /\.(astro|html|jsx|tsx|js|ts|mjs|svelte|vue)$/.test(f));
  const inlineSrc = srcFiles.filter((f) => /\sstyle\s*=\s*["'{]/.test(read(f)) || /setAttribute\(\s*["']style["']/.test(read(f)));
  const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
  const inlineBuilt = htmlFiles.filter((f) => /<[a-z][^>]*\sstyle\s*=\s*["']/i.test(read(f).replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')));
  check(
    'no inline style attributes in the source or the built HTML',
    inlineSrc.length === 0 && inlineBuilt.length === 0,
    `Classes only. Found style="..." in:\n${list(inlineSrc.concat(inlineBuilt.map((f) => path.relative('.', f))).map((f) => `- ${f}`))}`,
  );

  const cssText = htmlFiles.map((f) => (read(f).match(/<style[^>]*>[\s\S]*?<\/style>/gi) ?? []).join('\n')).concat(walk(dist).filter((f) => f.endsWith('.css')).map(read)).join('\n');
  const faces = cssText.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  const faceUrls = faces.flatMap((f) => [...f.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => m[1]));
  const distNames = new Set(walk(dist).map((f) => path.basename(f)));
  const remoteFace = faceUrls.filter((u) => /^(https?:)?\/\//.test(u));
  const missingFace = faceUrls.filter((u) => !/^(https?:)?\/\//.test(u) && !distNames.has(path.basename(u.split('?')[0])));
  const nonWoff2 = faceUrls.filter((u) => !/\.woff2(\?|$)/.test(u));
  check(
    'fonts are self-hosted woff2 files',
    faces.length > 0 && faceUrls.length > 0 && remoteFace.length === 0 && missingFace.length === 0 && nonWoff2.length === 0 && !/fonts\.(googleapis|gstatic)\.com/.test(cssText + htmlFiles.map(read).join('')),
    faces.length === 0
      ? 'The built CSS has no @font-face rule. Keep the .woff2 files in your project and declare them (in Astro, with fontProviders.local() in astro.config.mjs).'
      : `Every @font-face must point at a local .woff2 file in dist/.\n${list(remoteFace.concat(missingFace, nonWoff2).map((u) => `- ${u}`)) || 'The built HTML still mentions fonts.googleapis.com or fonts.gstatic.com.'}`,
  );

  const csp = findCsp();
  const cspProblems = [];
  if (!csp) cspProblems.push('No Content-Security-Policy found. Add a [[headers]] block to netlify.toml (or a public/_headers file).');
  else {
    if (!/(^|;)\s*default-src\s/.test(csp.value)) cspProblems.push("It needs a default-src directive, usually default-src 'self'.");
    if (/'unsafe-eval'/.test(csp.value)) cspProblems.push("Remove 'unsafe-eval'. Nothing on a site like this needs it.");
    const scriptSrc = /(?:^|;)\s*script-src\s([^;]*)/.exec(csp.value)?.[1] ?? /(?:^|;)\s*default-src\s([^;]*)/.exec(csp.value)?.[1] ?? '';
    if (/'unsafe-inline'/.test(scriptSrc) || /(^|\s)\*(\s|$)/.test(scriptSrc)) cspProblems.push("script-src must not allow 'unsafe-inline' or a bare *. Bundle your scripts so 'self' covers them.");
  }
  check('a Content-Security-Policy is defined and sensible', cspProblems.length === 0, cspProblems.join('\n'));

  /* 3. Rules that need a real browser. One browser, one page at a time. */
  const dash = { tests: null, sort: null, chart: null, table: null, toggle: null };
  if (dashboard) dashboardTests(dash, minTests);
  const { chromium } = await import('playwright');
  const state = { csp: csp?.value ?? null };
  const { origin, server } = await serve(dist, state);
  const thirdParty = new Set();
  const swallow = (fn) => fn().catch((e) => ({ error: e.message }));
  let browser;
  const found = { h1: [], desc: [], ld: [], og: [], csp: [], axe: [], overflow: [], motion: [] };
  const lighthousePages = [];
  let canonicalOrigin = null;

  try {
    browser = await chromium.launch();
    const open = async (ctxOptions, fn) => {
      const context = await browser.newContext(ctxOptions);
      await context.addInitScript(() => {
        window.__csp = [];
        document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`));
      });
      // Nothing leaves this machine. Anything that isn't local is refused, and remembered.
      await context.route('**/*', (route) => {
        const u = new URL(route.request().url());
        if (u.hostname === '127.0.0.1' || u.protocol === 'data:' || u.protocol === 'blob:') return route.continue();
        thirdParty.add(u.hostname);
        return route.abort();
      });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
      page.on('pageerror', (e) => consoleErrors.push(e.message));
      try {
        return await fn(page, consoleErrors);
      } finally {
        await context.close();
      }
    };

    /* 3a. Normal visit: head tags, then the CSP check (your policy applied, no bypass). */
    for (const p of pages) {
      await open({ viewport: { width: 1280, height: 800 } }, async (page, consoleErrors) => {
        await page.goto(origin + p, { waitUntil: 'load' });
        await page.waitForTimeout(500);
        const info = await page.evaluate(() => {
          const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null;
          return {
            h1: document.querySelectorAll('h1').length,
            desc: meta('meta[name="description"]'),
            canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
            og: meta('meta[property="og:image"]'),
            ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
            csp: window.__csp,
          };
        });
        if (info.h1 !== 1) found.h1.push(`- ${p}: expected one h1, found ${info.h1}`);
        const len = (info.desc ?? '').trim().length;
        if (len < 120 || len > 160) found.desc.push(`- ${p}: the description is ${len} characters (needs 120 to 160)`);
        if (info.canonical && !canonicalOrigin) canonicalOrigin = new URL(info.canonical).origin;

        // JSON-LD: parses, and has the fields a search engine needs to say what this is.
        const nodes = [];
        let bad = info.ld.length === 0 ? 'no JSON-LD block' : '';
        for (const raw of info.ld) {
          try {
            const j = JSON.parse(raw);
            if (!/schema\.org/.test(JSON.stringify(j['@context'] ?? ''))) bad ||= '@context should be https://schema.org';
            nodes.push(...(Array.isArray(j['@graph']) ? j['@graph'] : [j]));
          } catch (e) {
            bad ||= `it doesn't parse (${e.message.slice(0, 60)})`;
          }
        }
        if (!bad && !nodes.some((n) => n['@type'] && n.name && /^https?:\/\//.test(n.url ?? ''))) bad = 'one entity needs @type, name and an absolute url';
        if (bad) found.ld.push(`- ${p}: ${bad}`);

        // og:image: an absolute JPG or PNG that exists in dist. Never WebP.
        let ogWhy = '';
        if (!info.og) ogWhy = 'there is no og:image';
        else if (!/^https?:\/\//.test(info.og)) ogWhy = `${info.og} isn't an absolute URL`;
        else if (!/\.(jpe?g|png)$/i.test(new URL(info.og).pathname)) ogWhy = `${new URL(info.og).pathname} isn't a JPG or PNG (social networks can't read WebP)`;
        else if (!existsSync(path.join(dist, new URL(info.og).pathname))) ogWhy = `${new URL(info.og).pathname} isn't in the build`;
        if (ogWhy) found.og.push(`- ${p}: ${ogWhy}`);
        if (info.csp.length || consoleErrors.some((e) => /Content Security Policy|Refused to/i.test(e))) {
          found.csp.push(`- ${p}: ${(info.csp.concat(consoleErrors.filter((e) => /Content Security Policy|Refused to/i.test(e)))[0] ?? '').slice(0, 140)}`);
        }
      });
    }
    // The CSP is applied to the server for the pages above. Everything below runs without it, so the Playwright helpers can inject scripts.
    state.csp = null;

    /* 3b. axe-core on every page, with motion off so a half-finished fade can't fake a contrast problem. */
    const axeSource = read('node_modules/axe-core/axe.min.js');
    for (const p of pages) {
      await open({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }, async (page) => {
        await page.goto(origin + p, { waitUntil: 'load' });
        await page.waitForTimeout(400);
        await page.evaluate(axeSource);
        const result = await page.evaluate(() => axe.run(document, { resultTypes: ['violations'] }));
        for (const v of result.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) {
          const where = v.nodes[0]?.target?.join(' ') ?? '';
          found.axe.push(`- ${p}: ${v.id} (${v.impact}) ${v.help}${where ? `, e.g. ${where}` : ''}`);
        }
      });
    }

    /* 3c. Overflow at four widths. */
    for (const p of pages) {
      for (const width of WIDTHS) {
        await open({ viewport: { width, height: 900 }, reducedMotion: 'reduce' }, async (page) => {
          await page.goto(origin + p, { waitUntil: 'load' });
          await page.waitForTimeout(250);
          const wide = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
          if (wide > width + 1) found.overflow.push(`- ${p} at ${width}px: the page is ${wide}px wide`);
        });
      }
    }

    /* 3d. Reduced motion: nothing is left running, and nothing is left hidden waiting for an animation. */
    for (const p of pages) {
      await open({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }, async (page) => {
        await page.goto(origin + p, { waitUntil: 'load' });
        await page.waitForTimeout(1200);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y <= height; y += 500) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(60);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(700);
        const r = await page.evaluate(() => {
          const running = document.getAnimations().filter((a) => a.playState === 'running' || a.playState === 'pending');
          const g = window.gsap;
          const tweens = g?.globalTimeline ? g.globalTimeline.getChildren(true, true, false).filter((t) => t.isActive()).length : 0;
          const hidden = [];
          for (const el of document.body.querySelectorAll('*')) {
            if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
            if (!el.getClientRects().length) continue;
            const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (!own && el.tagName !== 'IMG') continue;
            let opacity = 1;
            for (let n = el; n; n = n.parentElement) opacity *= parseFloat(getComputedStyle(n).opacity);
            if (opacity < 0.95 || getComputedStyle(el).visibility === 'hidden') hidden.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''}`);
          }
          return { running: running.map((a) => a.animationName ?? a.transitionProperty ?? 'animation'), tweens, hidden };
        });
        if (r.running.length) found.motion.push(`- ${p}: ${r.running.length} animation(s) still running (${[...new Set(r.running)].slice(0, 3).join(', ')})`);
        if (r.tweens) found.motion.push(`- ${p}: ${r.tweens} GSAP tween(s) still active`);
        if (r.hidden.length) found.motion.push(`- ${p}: still hidden with reduced motion on: ${[...new Set(r.hidden)].slice(0, 3).join(', ')}`);
      });
    }

    /* 3e. Dashboard rules. */
    if (dashboard) await dashboardRules(open, origin, dash);
  } finally {
    await browser?.close();
    server.close();
  }

  check('every page has exactly one h1', found.h1.length === 0, list(found.h1));
  check('every page has a meta description of 120 to 160 characters', found.desc.length === 0, list(found.desc));
  check('every page has JSON-LD that parses and names what it is', found.ld.length === 0, list(found.ld));
  check('og:image is a JPG or PNG, never WebP', found.og.length === 0, list(found.og));
  check(
    'nothing loads from Google Fonts',
    ![...thirdParty].some((h) => /fonts\.(googleapis|gstatic)\.com/.test(h)),
    `A page asked ${[...thirdParty].filter((h) => /fonts\./.test(h)).join(' and ')} for a font. Host the font files yourself.`,
  );
  check('axe-core finds no serious or critical violations', found.axe.length === 0, list(found.axe));
  check('no horizontal overflow at 375, 768, 1280 and 1920 wide', found.overflow.length === 0, list(found.overflow));
  check('reduced motion stops every animation and keeps the content visible', found.motion.length === 0, list(found.motion));
  check(
    'the pages load under the policy with no CSP errors',
    csp !== null && found.csp.length === 0,
    csp ? `Your policy blocked something:\n${list(found.csp)}\nFix the page so it follows the policy. Don't loosen the policy to fit the page.` : 'There is no policy to test yet.',
  );
  if (dashboard) {
    check('you wrote at least ' + minTests + ' tests of your own, and they pass', dash.tests === true, dash.tests === true ? '' : dash.tests ?? 'The tests did not run.');
    check('the table sorts from the keyboard', dash.sort === true, dash.sort ?? 'Not checked.');
    check('the chart has an accessible name', dash.chart === true, dash.chart ?? 'Not checked.');
    check('the chart has a data table alternative', dash.table === true, dash.table ?? 'Not checked.');
    check('the period toggle changes the numbers', dash.toggle === true, dash.toggle ?? 'Not checked.');
  }

  /* 4. Lighthouse, last, with its own Chromium from Playwright's cache. Accessibility and SEO scores, plus
        three structural audits. Never the performance score. */
  await lighthouseRules(dist, pages, state, canonicalOrigin);
  return true;
}

/* ---------- dashboard rules ---------- */
function dashboardTests(dash, min) {
  // The learner's own tests: counted in the source, then run for real.
  const testFiles = walk('tests').concat(walk('src')).filter((f) => /\.test\.(js|jsx|ts|tsx)$/.test(f));
  const count = testFiles.reduce((n, f) => n + (read(f).match(/(^|[^\w.])(it|test)(\.each)?\s*\(/g) ?? []).length, 0);
  if (count < min) dash.tests = `Found ${count} test(s) in tests/. Write at least ${min}: totals, the period toggle, sorting, the chart's text alternative.`;
  else {
    const file = path.join(os.tmpdir(), `bs-gate-${process.pid}.json`);
    spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${file}`], { encoding: 'utf8', timeout: 240000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1' } });
    let report = null;
    try {
      report = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      /* handled below */
    }
    rmSync(file, { force: true });
    if (!report) dash.tests = 'Vitest produced no report. Run "npx vitest run" in the terminal to see why.';
    else if (report.numFailedTests > 0 || report.numFailedTestSuites > 0) {
      const names = report.testResults.flatMap((r) => r.assertionResults.filter((t) => t.status === 'failed').map((t) => `- ${t.title}`));
      dash.tests = `${report.numFailedTests} of your tests fail:\n${names.slice(0, 4).join('\n')}`;
    } else if (report.numPassedTests < min) dash.tests = `Only ${report.numPassedTests} tests ran. Write at least ${min}.`;
    else dash.tests = true;
  }
}

async function dashboardRules(open, origin, dash) {
  await open({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }, async (page) => {
    await page.goto(origin + '/', { waitUntil: 'load' });
    await page.waitForTimeout(800);

    // Keyboard sorting: Tab to a sort button in the table header, press Enter twice, read what the table does.
    let reached = false;
    for (let i = 0; i < 80 && !reached; i++) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => !!document.activeElement?.closest('table thead') && document.activeElement.tagName === 'BUTTON');
    }
    if (!reached) dash.sort = 'Tab never reaches a button in the table header. Each sortable column needs a <button> inside its <th>.';
    else {
      const readTable = () =>
        page.evaluate(() => {
          const th = document.activeElement.closest('th');
          const table = th.closest('table');
          const col = [...th.parentElement.children].indexOf(th);
          return { sort: th.getAttribute('aria-sort'), cells: [...table.querySelectorAll('tbody tr')].map((r) => r.children[col]?.textContent.trim() ?? '') };
        });
      const order = (cells) => {
        const nums = cells.map((c) => parseFloat(c.replace(/[^0-9.\-]/g, '')));
        const numeric = nums.every((n) => !Number.isNaN(n));
        const key = numeric ? nums : cells;
        const sorted = (cmp) => key.every((v, i) => i === 0 || cmp(key[i - 1], v) <= 0);
        const cmp = numeric ? (a, b) => a - b : (a, b) => String(a).localeCompare(String(b));
        return sorted(cmp) ? 'ascending' : sorted((a, b) => cmp(b, a)) ? 'descending' : 'none';
      };
      await page.keyboard.press('Enter');
      await page.waitForTimeout(150);
      const first = await readTable();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(150);
      const second = await readTable();
      if (first.sort !== 'ascending' || order(first.cells) !== 'ascending') dash.sort = `Enter on a header should sort ascending and set aria-sort="ascending". After Enter: aria-sort is "${first.sort}" and the rows read ${order(first.cells)}.`;
      else if (second.sort !== 'descending' || order(second.cells) !== 'descending') dash.sort = `Enter a second time should sort descending. aria-sort is "${second.sort}" and the rows read ${order(second.cells)}.`;
      else dash.sort = true;
    }

    // The chart: a name for the picture, and the same numbers as a table.
    const chart = await page.evaluate(() => {
      const pics = [...document.querySelectorAll('[role="img"][aria-label]')].filter((e) => e.querySelector('svg'));
      const label = pics[0]?.getAttribute('aria-label') ?? '';
      const holder = pics[0]?.closest('figure, section, article') ?? pics[0]?.parentElement;
      const tables = holder ? [...holder.querySelectorAll('table')] : [];
      const best = tables.map((t) => ({ rows: t.querySelectorAll('tbody tr').length, heads: t.querySelectorAll('th').length })).sort((a, b) => b.rows - a.rows)[0];
      return { found: pics.length > 0, label, rows: best?.rows ?? 0, heads: best?.heads ?? 0 };
    });
    dash.chart = !chart.found
      ? 'Wrap the chart in an element with role="img" and an aria-label that says what the chart shows, in a sentence.'
      : chart.label.trim().length >= 25
        ? true
        : `The chart's aria-label is only ${chart.label.trim().length} characters. Describe the finding: what's highest, what's lowest, the trend.`;
    dash.table = chart.rows >= 4 && chart.heads >= 2 ? true : 'Put the chart numbers in a real <table> (with <th> headers and at least four rows) in the same <figure> as the chart, in a <details> if you like.';

    // The period toggle: buttons with aria-pressed. Choosing another one must move the pressed state and change the KPI numbers.
    const kpis = () => page.evaluate(() => [...document.querySelectorAll('[data-testid="kpi"]')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join('|'));
    const buttons = page.locator('button[aria-pressed]');
    const n = await buttons.count();
    const tiles = await page.locator('[data-testid="kpi"]').count();
    if (n < 3) dash.toggle = `Found ${n} button(s) with aria-pressed. The period toggle needs three (for example 7, 30 and 90 days).`;
    else if (tiles < 4) dash.toggle = `Found ${tiles} KPI tile(s) with data-testid="kpi". The brief asks for four.`;
    else {
      const before = await kpis();
      const pressedBefore = await page.evaluate(() => [...document.querySelectorAll('button[aria-pressed]')].findIndex((b) => b.getAttribute('aria-pressed') === 'true'));
      const target = pressedBefore === 0 ? 1 : 0;
      await buttons.nth(target).click();
      await page.waitForTimeout(250);
      const after = await kpis();
      const pressedAfter = await page.evaluate(() => [...document.querySelectorAll('button[aria-pressed]')].findIndex((b) => b.getAttribute('aria-pressed') === 'true'));
      dash.toggle = pressedAfter !== target ? 'After a click, that button should be the only one with aria-pressed="true".' : after === before ? 'The KPI tiles show the same numbers for both periods. Each period needs its own figures.' : true;
    }
  });
}

/* ---------- Lighthouse ---------- */
async function lighthouseRules(dist, pages, state, canonicalOrigin) {
  const [{ chromium }, chromeLauncher, { default: lighthouse }] = await Promise.all([import('playwright'), import('chrome-launcher'), import('lighthouse')]);
  const { server, origin } = await serve(dist, state);
  if (canonicalOrigin) state.rewrite = { from: canonicalOrigin, to: origin };
  const scores = { accessibility: [], seo: [] };
  const structural = { unsized: [], blocking: [], images: [] };
  const AUDITS = ['unsized-images', 'render-blocking-insight', 'image-size-responsive'];
  let broke = '';
  try {
    for (const p of pages) {
      // A fresh Chromium for each page, closed before the next. Never two at once.
      const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
      try {
        const { lhr } = await lighthouse(origin + p, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['accessibility', 'seo'], onlyAudits: AUDITS });
        for (const k of Object.keys(scores)) scores[k].push({ p, score: Math.round((lhr.categories[k].score ?? 0) * 100), failing: Object.values(lhr.audits).filter((a) => lhr.categories[k].auditRefs.some((r) => r.id === a.id && r.weight > 0) && a.score !== null && a.score < 1).map((a) => a.title) });
        const a = lhr.audits;
        const names = (id) => (a[id]?.details?.items ?? []).map((i) => i.node?.snippet ?? i.url ?? '').filter(Boolean);
        if (a['unsized-images'] && a['unsized-images'].score !== 1 && a['unsized-images'].score !== null) structural.unsized.push(`- ${p}: ${names('unsized-images').slice(0, 2).join(' ')}`);
        if (a['render-blocking-insight'] && (a['render-blocking-insight'].details?.items?.length ?? 0) > 0 && a['render-blocking-insight'].score !== null && a['render-blocking-insight'].score < 1) structural.blocking.push(`- ${p}: ${names('render-blocking-insight').slice(0, 2).join(' ')}`);
        if (a['image-size-responsive'] && a['image-size-responsive'].score !== 1 && a['image-size-responsive'].score !== null) structural.images.push(`- ${p}: ${names('image-size-responsive').slice(0, 2).join(' ')}`);
      } finally {
        await chrome.kill();
      }
    }
  } catch (e) {
    broke = e.message.split('\n')[0];
  } finally {
    server.close();
  }
  const report = (k) => scores[k].filter((s) => s.score < 95).map((s) => `- ${s.p}: ${s.score}. Failing: ${s.failing.slice(0, 3).join('; ')}`);
  check('Lighthouse accessibility is 95 or more on every page', !broke && scores.accessibility.length === pages.length && report('accessibility').length === 0, broke || list(report('accessibility')));
  check('Lighthouse SEO is 95 or more on every page', !broke && scores.seo.length === pages.length && report('seo').length === 0, broke || list(report('seo')));
  check('Lighthouse: every image has a width and height', !broke && structural.unsized.length === 0, broke || `Set width and height (or use an Astro or framework image component) so the browser reserves the space.\n${list(structural.unsized)}`);
  check('Lighthouse: nothing blocks the first paint', !broke && structural.blocking.length === 0, broke || `A stylesheet or script in the head holds the page back. Inline the CSS in the page instead (Astro: build.inlineStylesheets 'always'. Vite: a small transformIndexHtml plugin that swaps the link for a style tag).\n${list(structural.blocking)}`);
  check('Lighthouse: images are big enough for their slot', !broke && structural.images.length === 0, broke || `An image is smaller than the space it fills (on a 2x screen it goes soft). Serve a larger file.\n${list(structural.images)}`);
}

// Run directly: node gate.mjs
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runGate({ dashboard: process.argv.includes('--dashboard') });
}
