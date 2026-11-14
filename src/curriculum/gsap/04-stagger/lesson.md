Animate eight cards together and they land like a single slab. Animate them with a short gap between each and they read as a wave, and the eye follows it. That's a **stagger**, and it's the cheapest way to make a grid feel designed.

On Ellis Ward, Willow Cove and almost every other example, groups of cards, fees and team members arrive this way: `stagger: 0.1` on a `from`, usually with `y: 30` and `opacity: 0`.

## The simple version

```js
gsap.from('.card', { opacity: 0, y: 30, duration: 0.6, stagger: 0.08 });
```

It's still **one tween**. GSAP offsets each target by `0.08` seconds. That's why you don't need a loop, and why changing the duration later changes everything at once.

## The "total time" problem

A fixed gap means a longer list takes longer overall. Twelve items at `0.1` is 1.1 seconds of waiting before the last appears, which is too slow. Use `amount` instead and say how long the *whole wave* takes:

```js
stagger: { amount: 0.9 }
```

Now it's 0.9 seconds whether there are 5 items or 50. Rule of thumb on a premium site: the whole entrance should be under about two seconds.

## Where the wave starts

The object form has more options:

```js
stagger: { amount: 0.9, from: 'center' }   // ripples outward
stagger: { each: 0.05, from: 'end' }       // right to left
stagger: { each: 0.05, from: 'random' }
```

`from: 'center'` is lovely for rows of dots or logos. `'edges'` does the opposite, converging on the middle.

For a grid, add `grid: [rows, columns]` and the wave travels across it in two dimensions. It's worth knowing, but don't reach for it first.

## Your turn

1. Reveal the eight `.gs-tile` cards with `gsap.from`: `opacity: 0`, `y: 30`, `duration: 0.6`, `stagger: 0.08`.
2. Reveal the twelve `.gs-dot` elements with `opacity: 0`, `scale: 0`, `duration: 0.5`, and a stagger **object**: `amount: 0.9` from the `'center'`. Give that tween `delay: 0.8` so it follows the tiles.
3. Keep both inside `if (!calm)` so reduced-motion visitors see the finished page.

Reload the preview to watch the wave, then try `from: 'edges'` just to see it.

> Staggered text is the same trick: split a heading into words or letters and stagger those. GSAP's free SplitText plugin does the splitting.
