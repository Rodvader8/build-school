// Screenshots two pages and compares them.  Run it with:  node visual-diff.mjs pages/before.html pages/after.html
// It writes diff.png (changes painted red) and report.json, and prints "changed" or "same".
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
import { blockAnalytics } from './lib.mjs';
import { compareImages } from './diff.mjs';

const [beforePage = 'pages/before.html', afterPage = 'pages/after.html'] = process.argv.slice(2);
const MAX_RATIO = 0.001; // more than 0.1% of the picture different counts as a change

const server = await serve('.');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await blockAnalytics(page);

  /** A repeatable screenshot of one of the local pages, as a PNG buffer. */
  async function shoot(file) {
    await page.goto(server.url + file);
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
  }

  const before = await shoot(beforePage);
  const after = await shoot(afterPage);
  const result = compareImages(before, after);

  const verdict = result.sizeMismatch || result.ratio > MAX_RATIO ? 'changed' : 'same';
  if (result.diffPng) writeFileSync('diff.png', result.diffPng);
  writeFileSync('report.json', JSON.stringify({ beforePage, afterPage, diffPixels: result.diffPixels ?? null, ratio: result.ratio ?? null, sizeMismatch: !!result.sizeMismatch, verdict }, null, 2));
  console.log(verdict);
} finally {
  await browser.close();
  await server.close();
}
