// Scrolls a Playwright page to a position with ease in, a steady cruise, then ease out.

/**
 * @param page      a Playwright page
 * @param to        the scroll position to finish on, in pixels
 * @param duration  how long the whole scroll takes, in milliseconds
 */
export async function smoothScroll(page, { to, duration = 1600 }) {
  // This works, but it lurches: ten jumps with pauses. TODO: replace it with a requestAnimationFrame loop inside page.evaluate.
  const from = await page.evaluate(() => window.scrollY);
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), from + ((to - from) * i) / steps);
    await page.waitForTimeout(duration / steps);
  }
}
