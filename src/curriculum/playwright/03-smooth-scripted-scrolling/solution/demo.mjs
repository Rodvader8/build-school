// Scrolls the local page with your smoothScroll. Add --headed to watch it in a real window:  node demo.mjs --headed
// Provided for you.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { blockAnalytics } from './lib.mjs';
import { smoothScroll } from './smooth-scroll.mjs';

const server = await serve('site');
const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await blockAnalytics(page);
  await page.goto(server.url);
  await page.waitForTimeout(800);
  await smoothScroll(page, { to: 2400, duration: 3000 });
  await page.waitForTimeout(800);
  await smoothScroll(page, { to: 0, duration: 3000 });
  await page.waitForTimeout(800);
} finally {
  await browser.close();
  await server.close();
}
