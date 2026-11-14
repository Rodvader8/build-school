Carrow & Finch has a results strip where the numbers count up as you reach them. It's a small touch that makes the numbers land. It takes three tools you'll use for all scroll-driven work.

## IntersectionObserver: "tell me when this is on screen"

Checking positions on every scroll event is slow. Instead, let the browser tell you:

```js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      countUp(entry.target);
      observer.unobserve(entry.target);   // only once
    }
  }
}, { threshold: 0.5 });   // when half of it is visible

for (const el of stats) observer.observe(el);
```

## requestAnimationFrame: smooth animation

`requestAnimationFrame(fn)` runs `fn` just before the next screen refresh, about 60 times a second, and gives it the current time. Each frame you work out how far through the animation you are:

```js
const t = Math.min((now - start) / DURATION, 1);   // 0 at the start, 1 at the end
el.textContent = format(target * easeOut(t));
if (t < 1) requestAnimationFrame(frame);           // keep going until done
```

`easeOut` makes it start fast and settle gently, like GSAP's eases. `(t) => 1 - Math.pow(1 - t, 3)` is a cubic ease out.

## Reduced motion, again

```js
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

If it's true, skip the animation and show the final numbers. Same rule as the CSS track: motion is a bonus, never a requirement.

## Your turn

1. Write `countUp(el)` to animate from 0 to `el.dataset.target` over `DURATION`, with commas (`1,284`).
2. Watch the stats with an `IntersectionObserver` and count each one once.
3. With reduced motion, set the final numbers straight away.

Scroll the preview down to test it, and press the reload button above it to replay.
