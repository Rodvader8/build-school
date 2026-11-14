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

if (!existsSync('node_modules/axe-core') || !existsSync('node_modules/playwright')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { chromium } = await import('playwright');
const { serve } = await import(pathToFileURL(path.resolve('serve.mjs')).href);

const server = await serve('site');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(server.url);
  await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });

  /* ---- axe-core: every WCAG A and AA rule, plus its best-practice rules ---- */
  const result = await page.evaluate(() =>
    axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }),
  );
  const found = (...ids) => result.violations.filter((v) => ids.includes(v.id));
  const explain = (list) =>
    list.map((v) => `${v.id}: ${v.nodes[0]?.html.replace(/\s+/g, ' ').slice(0, 90)}`).join('\n');
  const group = (name, ids, hint) => {
    const bad = found(...ids);
    check(name, bad.length === 0, `${explain(bad)}\n${hint}`);
  };
  group('language, title and landmarks', ['html-has-lang', 'html-lang-valid', 'document-title', 'landmark-one-main', 'region', 'landmark-unique', 'bypass'], 'Add lang="en-AU" to <html>, and put the page in <header>, <nav>, <main> and <footer>.');
  group('text has enough contrast', ['color-contrast'], 'Darken the text or lighten the background until the ratio is at least 4.5 to 1.');
  group('every image has a text alternative', ['image-alt', 'role-img-alt'], 'Add alt="..." that says what the picture shows.');
  const unlabelled = await page.evaluate(() =>
    [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea')].filter((el) => el.labels.length === 0).map((el) => el.name || el.tagName),
  );
  const labelBad = found('label', 'select-name');
  check('every form field has a label', labelBad.length === 0 && unlabelled.length === 0, `${explain(labelBad)}${unlabelled.length ? `\nNo <label>: ${unlabelled.join(', ')}` : ''}\nAdd <label for="id"> for each field. A placeholder is not a label.`);
  group('every button and link has a name', ['button-name', 'link-name'], 'Add visible text or aria-label, and aria-hidden="true" on a decorative icon.');
  group('headings are in order', ['heading-order', 'page-has-heading-one', 'empty-heading'], 'Go h1, then h2, then h3, never skipping a level.');

  /* ---- the keyboard: press Tab through the page and watch where focus goes ---- */
  const focusables = await page.evaluate(() => document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])').length);
  const stops = [];
  for (let i = 0; i < focusables + 1; i++) {
    await page.keyboard.press('Tab');
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          label: `<${el.tagName.toLowerCase()}${el.id ? ' #' + el.id : ''}> ${(el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '').trim().slice(0, 24)}`,
          href: el.getAttribute('href'),
          tabindex: el.getAttribute('tabindex'),
          outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
          shadow: s.boxShadow !== 'none',
          top: r.top + window.scrollY,
          index: [...document.querySelectorAll('*')].indexOf(el),
          targetIsMain: el.getAttribute('href')?.startsWith('#') ? document.querySelector(el.getAttribute('href'))?.tagName === 'MAIN' : false,
        };
      }),
    );
  }
  const real = stops.filter(Boolean);

  check('the first tab stop is a skip link', real[0]?.href?.startsWith('#') && real[0].targetIsMain, `The first Tab stop is ${real[0]?.label ?? 'nothing'}. Add <a class="skip" href="#main">Skip to content</a> as the first thing in <body>, and id="main" on <main>.`);

  const positive = found('tabindex').length > 0 || real.some((s) => parseInt(s.tabindex ?? '0', 10) > 0);
  const inOrder = real.every((s, i) => i === 0 || (s.index > real[i - 1].index && s.top >= real[i - 1].top - 24));
  check('tab order follows the reading order', !positive && inOrder && real.length >= focusables, positive ? 'A positive tabindex (like tabindex="3") reorders the page. Remove it.' : `Focus moved out of reading order, or skipped something: ${real.map((s) => s.label).join(' > ')}`);

  const unseen = real.filter((s) => !s.outline && !s.shadow);
  check('focus is always visible', real.length > 0 && unseen.length === 0, `No visible focus on: ${unseen.map((s) => s.label).join(', ')}. Never write outline: none without a replacement.`);

  /* ---- the final proof: nothing left at all ---- */
  check('axe-core finds no violations', result.violations.length === 0, explain(result.violations));
} finally {
  await browser.close();
  await server.close();
}
