// Takes full-page screenshots of the local page at four widths.  Run it with:  node shots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
import { blockAnalytics } from './lib.mjs';

const WIDTHS = [375, 768, 1280, 1920];

mkdirSync('shots', { recursive: true });
const server = await serve('site');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await blockAnalytics(page);
  await page.goto(server.url);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 800 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `shots/home-${width}.png`, fullPage: true, animations: 'disabled' });
    console.log(`Saved shots/home-${width}.png`);
  }
} finally {
  await browser.close();
  await server.close();
}
