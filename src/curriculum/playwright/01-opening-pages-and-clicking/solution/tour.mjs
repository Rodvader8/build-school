// Opens the local page, clicks around, and writes what it found to result.json.  Run it with:  node tour.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';

const TRACKERS = ['/analytics/', 'googletagmanager.com', 'google-analytics.com', 'hotjar.com'];

/** Stops tracking requests from leaving the browser. Call it before page.goto. */
async function blockTrackers(page) {
  await page.route('**/*', (route) => (TRACKERS.some((t) => route.request().url().includes(t)) ? route.abort() : route.continue()));
}

const server = await serve('site'); // the page, on this machine only
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await blockTrackers(page);
  await page.goto(server.url);

  const result = { title: await page.title() };

  await page.getByRole('button', { name: 'Menu' }).click();
  result.menuOpen = (await page.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')) === 'true';
  result.menuLinks = await page.locator('#menu a').allTextContents();

  result.services = await page.locator('#services li').allTextContents();

  await page.getByRole('button', { name: 'Send enquiry' }).click();
  result.errorShown = await page.locator('#error').isVisible();

  await page.getByLabel('Your name').fill('Sam Example');
  await page.getByLabel('Email').fill('sam@example.com');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  result.thanks = (await page.locator('#thanks').textContent()).trim();

  writeFileSync('result.json', JSON.stringify(result, null, 2));
  console.log(result);
} finally {
  await browser.close();
  await server.close();
}
