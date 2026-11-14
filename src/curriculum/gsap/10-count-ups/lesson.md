Carrow & Finch's results strip counts its numbers up as you reach them: 184 homes sold, 1,284 buyers, 97% of asking price. In the JavaScript track you built this by hand with `IntersectionObserver` and `requestAnimationFrame`. In GSAP it's a lot shorter, and you get eases and ScrollTrigger for free.

## GSAP can animate any number

A tween doesn't have to target an element. It can target a plain JavaScript object and animate its numbers:

```js
const counter = { value: 0 };
gsap.to(counter, {
  value: 184,
  duration: 1.8,
  ease: 'power2.out',
  onUpdate: () => { el.textContent = format(counter.value); },
});
```

- `counter` is just a holder. GSAP changes `counter.value` from 0 to 184.
- `onUpdate` is a **callback**, a function GSAP calls after every frame. That's where you copy the current number onto the page.
- `ease: 'power2.out'` makes the count rush early and settle on the last few digits, which is where the eye is looking.

## Format it properly

```js
const format = (n) => Math.round(n).toLocaleString('en-AU');
```

`Math.round` removes decimals mid-count (GSAP's numbers are smooth, and `184.3` looks broken), and `toLocaleString('en-AU')` adds the thousands comma. Set `font-variant-numeric: tabular-nums` in the CSS so the digits all have the same width and the number doesn't wobble as it grows. The starter's CSS already does.

## Once only

```js
scrollTrigger: { trigger: el, start: 'top 85%', once: true }
```

`once: true` fires the trigger a single time and removes it. Nobody wants numbers that re-count every time they scroll back past. A good setting fires when the strip is about 85% of the way up the screen, so the count is under way as it settles into view.

## Reduced motion: show the answer

For a count-up, there's nothing in-between worth saving. If the visitor wants less motion, write the **final** numbers into the page immediately, and skip the tween. The page still says exactly the same thing.

> One honest caveat: starting every number at 0 means anyone without JavaScript sees zeros. For real client work, put the true number in the HTML and let the script *replace* it with 0 just before counting. Then if the script never runs, the page is still right.

## Your turn

1. In reduced motion, write `format(Number(el.dataset.target))` into every stat and stop.
2. Otherwise, loop over the stats. For each, make a `counter` object and tween its `value` to the stat's `data-target` over `1.8` seconds with `power2.out`.
3. Use `onUpdate` to write the formatted number into the element.
4. Give each tween a ScrollTrigger: the stat is the trigger, `start: 'top 85%'`, `once: true`.

Scroll the preview down to the results, then back up and down again to check it doesn't replay.
