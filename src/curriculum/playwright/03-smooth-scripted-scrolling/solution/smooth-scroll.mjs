// Scrolls a Playwright page to a position with ease in, a steady cruise, then ease out.

/**
 * @param page      a Playwright page
 * @param to        the scroll position to finish on, in pixels
 * @param duration  how long the whole scroll takes, in milliseconds
 * @param ease      the fraction of the time spent easing in, and again easing out
 */
export async function smoothScroll(page, { to, duration = 1600, ease = 0.2 }) {
  await page.evaluate(
    ({ to, duration, a }) =>
      new Promise((resolve) => {
        const from = window.scrollY;
        const vmax = 1 / (1 - a); // the cruise speed that makes the three phases add up to the full distance
        const progress = (t) => {
          if (t < a) return (vmax * t * t) / (2 * a); // speeding up
          if (t < 1 - a) return vmax * (a / 2) + vmax * (t - a); // steady
          const r = 1 - t;
          return 1 - (vmax * r * r) / (2 * a); // slowing down
        };
        const start = performance.now();
        const frame = (now) => {
          const t = Math.min(Math.max((now - start) / duration, 0), 1);
          window.scrollTo({ top: from + (to - from) * progress(t), behavior: 'instant' });
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      }),
    { to, duration, a: ease },
  );
}
