// Runs Lighthouse against a page using the Chromium that Playwright already installed. Provided for you.
import { chromium } from 'playwright';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

/** Opens Chromium, runs Lighthouse's performance audits on one URL and closes Chromium again. Returns the full report. */
export async function lighthouseReport(url) {
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });
  try {
    const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', onlyCategories: ['performance'], logLevel: 'error' });
    return lhr;
  } finally {
    await chrome.kill();
  }
}

/** One audit, boiled down to the numbers people quote: score (0 to 100), LCP and TBT in ms, and CLS. */
export async function auditOnce(url) {
  const { audits, categories } = await lighthouseReport(url);
  return {
    score: Math.round(categories.performance.score * 100),
    lcp: Math.round(audits['largest-contentful-paint'].numericValue),
    tbt: Math.round(audits['total-blocking-time'].numericValue),
    cls: Number(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
  };
}
