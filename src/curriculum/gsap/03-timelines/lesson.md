One tween is a gesture. A **timeline** is a sentence: several tweens in a row, with you deciding exactly when each one starts. Most animated heroes, Larkfield's included, are timelines.

Without one, you'd be adding `delay: 0.4`, `delay: 0.8` and so on by hand, and changing the first would mean redoing all the rest. A timeline puts them in sequence for you.

## Making one

```js
const intro = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });

intro
  .from('.gs-kicker', { y: 20, opacity: 0 })
  .from('.gs-title', { y: 40, opacity: 0 });
```

- `defaults` are shared by every tween inside, so you don't repeat yourself.
- Each tween waits for the one before it to finish. That's the whole idea.
- It plays as soon as it's created.

## The position parameter

The optional third argument says *where* in the timeline a step starts. This is the part that turns a list into choreography.

```js
.from('.gs-title', { y: 40, opacity: 0 }, '-=0.5')   // 0.5s before the previous step ends
.from('.gs-lede',  { y: 30, opacity: 0 }, '<')        // same moment the previous step starts
.from('.gs-lede',  { y: 30, opacity: 0 }, '<0.15')    // 0.15s after the previous step starts
.from('.gs-cta',   { opacity: 0 }, 1.2)               // exactly 1.2s from the start
```

Overlap is what makes an intro feel smooth instead of mechanical. If each piece waits for the last to finish completely, it feels like slides. Starting each one a little early makes it feel like a single gesture.

## Controlling a timeline

A timeline is an object you can steer:

```js
intro.pause();
intro.play();
intro.restart();
intro.progress(1);   // jump to the end
```

That last one is a neat reduced-motion trick: jump to the finished state and nothing is hidden.

## Your turn

1. Create `intro` with defaults of `duration: 0.8` and `ease: 'power3.out'`.
2. Chain four `from` steps: the kicker, the title (overlapping the kicker with `'-=0.5'`), the lede (`'<0.15'`), and the button (`scale: 0.9`).
3. Wire the Replay button to `intro.restart()`.

For reduced motion, finish the timeline with `intro.progress(1)` so the page is complete straight away.

> Scrubbing is coming in lesson 6, and a timeline is exactly what you'll scrub. Everything you build here is reusable then.
