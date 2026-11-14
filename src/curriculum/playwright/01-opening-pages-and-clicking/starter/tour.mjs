// Opens the local page, clicks around, and writes what it found to result.json.  Run it with:  node tour.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';

const TRACKERS = []; // TODO: the local stand-in "/analytics/" plus googletagmanager.com, google-analytics.com and hotjar.com

/** Stops tracking requests from leaving the browser. Call it before page.goto. */
async function blockTrackers(page) {
  // TODO: page.route('**/*', ...) that aborts anything matching TRACKERS and lets the rest through
}

const server = await serve('site'); // the page, on this machine only
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await blockTrackers(page);
  await page.goto(server.url);

  const result = { title: await page.title() };

  // TODO: click the Menu button, then:  result.menuOpen = (aria-expanded is "true")  and  result.menuLinks = text of each link in #menu
  // TODO: result.services = the text of each <li> in #services
  // TODO: click "Send enquiry" with nothing filled in, then:  result.errorShown = is #error visible?
  // TODO: fill "Your name" and "Email", click "Send enquiry", then:  result.thanks = text of #thanks

  writeFileSync('result.json', JSON.stringify(result, null, 2));
  console.log(result);
} finally {
  await browser.close();
  await server.close();
}
