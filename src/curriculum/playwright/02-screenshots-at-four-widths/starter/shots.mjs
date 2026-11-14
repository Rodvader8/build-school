// Takes full-page screenshots of the local page at four widths.  Run it with:  node shots.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
import { blockAnalytics } from './lib.mjs';

const WIDTHS = [1280]; // TODO: 375, 768, 1280 and 1920

mkdirSync('shots', { recursive: true });
const server = await serve('site');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.url);

  // TODO: for each width: set the viewport, wait for fonts, then screenshot to shots/home-<width>.png (full page)
  await page.screenshot({ path: 'shots/home-1280.png' });
} finally {
  await browser.close();
  await server.close();
}
