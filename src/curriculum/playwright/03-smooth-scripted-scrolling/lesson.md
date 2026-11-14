When you record a screen walkthrough of a site, the scroll is what makes it look professional or amateur. A scroll that lurches between positions looks like a bug. A scroll that eases in, glides at a steady pace, then eases out looks like a person who knows what they're doing. This is the standard for every screen recording you'll make.

## Three ways that don't work

- **`window.scrollTo(0, 2400)`** jumps instantly. Nothing to watch.
- **A loop of small `scrollTo` calls with sleeps.** Each pause is imprecise, so the speed wobbles, and every step is a visible stutter.
- **`behavior: 'smooth'`.** The browser animates for you, but you can't control the speed or the easing, and it varies between browsers and settings. Useless when you need the same result every take.

## The reliable way: do it inside the page, on every frame

A browser paints about 60 times a second. `requestAnimationFrame` runs your function just before each paint, so changing the scroll position in it means one small step per frame, perfectly in time with the screen. The trick that makes it consistent on a slow or busy machine: base the position on **elapsed time**, not on how many frames have run.

```js
const start = performance.now();
function frame(now) {
  const t = Math.min((now - start) / duration, 1); // 0 at the start, 1 at the end
  window.scrollTo(0, from + (to - from) * progress(t));
  if (t < 1) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

`progress(t)` turns time into distance travelled (0 to 1). If it simply returned `t`, you'd get constant speed with abrupt starts and stops. We want three phases:

1. **Ease in:** speed rises from zero over the first part of the time.
2. **Cruise:** a steady speed through the middle.
3. **Ease out:** speed falls back to zero over the last part.

With `a` as the fraction of time spent easing at each end (0.2 works well), and `vmax = 1 / (1 - a)` so the total distance comes out at exactly 1:

```js
function progress(t) {
  if (t < a) return (vmax * t * t) / (2 * a);               // speeding up
  if (t < 1 - a) return vmax * (a / 2) + vmax * (t - a);    // steady
  const r = 1 - t;
  return 1 - (vmax * r * r) / (2 * a);                       // slowing down
}
```

## Running it from Playwright

Playwright's `page.evaluate` runs a function *inside* the page. Pass your numbers in as the second argument, and return a promise that resolves when the scroll ends. Playwright waits for it.

```js
await page.evaluate(({ to, duration }) => new Promise((resolve) => { /* the loop above, calling resolve() at t = 1 */ }), { to, duration });
```

## How Check my work knows it's smooth

It runs your function in a real browser while a second `requestAnimationFrame` loop writes down the scroll position on every frame. Then it splits the movement into ten equal time slices and measures the speed in each: slow in the first, steady across the middle six, slow in the last. A scroll with the wrong shape (or a jumpy one) can't pass.

## Your turn

1. Open `smooth-scroll.mjs`. The starter makes ten jumps with sleeps between. Replace the body of `smoothScroll` with one `page.evaluate` that runs a `requestAnimationFrame` loop.
2. Use the `progress(t)` formula above.
3. Run `node demo.mjs --headed` in the terminal to watch the scroll in a real window. Compare it against the starter's jumps if you like.
4. Press **Check my work**.
