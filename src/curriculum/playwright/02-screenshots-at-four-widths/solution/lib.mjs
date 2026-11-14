// Helpers from the last lesson, ready to use. Provided for you.

const TRACKERS = ['/analytics/', 'googletagmanager.com', 'google-analytics.com', 'hotjar.com', 'segment.com', 'facebook.net', 'doubleclick.net'];

/** Stops tracking requests from leaving the browser, so your runs never add fake visitors to anyone's numbers. Call it before page.goto. */
export async function blockAnalytics(page) {
  await page.route('**/*', (route) => (TRACKERS.some((t) => route.request().url().includes(t)) ? route.abort() : route.continue()));
}
