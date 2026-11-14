Two animations can cover the same distance in the same time and feel completely different. The difference is **easing**: how the speed changes along the way.

Larkfield, and many polished sites, use `expo.out` for reveals. It starts fast and settles very softly, so things feel like they arrive rather than stop. That one choice is a big part of why a page reads as "premium" instead of "template".

## The ease names

Every ease has a name and a direction:

```js
gsap.to('.box', { x: 600, ease: 'power3.out' });
```

- **`.out`** is fast at the start and slow at the end. Use it for things *arriving*. It's the one you'll use 90% of the time.
- **`.in`** is slow at the start and fast at the end. Good for things *leaving*.
- **`.inOut`** does both. It suits anything that travels a long way across the screen, like a scrubbed colour change.
- **`none`** is a constant speed. It sounds boring, but it's exactly right for anything tied to scrolling, because the scroll bar is already your easing. You'll see `ease: 'none'` all through the pinned examples.

The number after `power` is the strength: `power1` is gentle, `power4` is dramatic. `expo` is stronger again.

## Eases with character

- `back.out(1.7)` overshoots its target and comes back, like something with a little weight. The number is how far it overshoots.
- `elastic.out(1, 0.4)` wobbles like a spring. Fun, but use it on a premium site the way you'd use hot sauce.

## Set defaults once

If most tweens share a duration or ease, say so once:

```js
gsap.defaults({ duration: 1.2, ease: 'expo.out' });
```

Any tween can still override it. This is how polished sites keep their motion consistent: one house ease, one house duration, and rare exceptions.

## Your turn

1. Call `gsap.defaults` to set a duration of `1.2` seconds.
2. Move all four balls `x: 600` with `gsap.to`, each with the ease named beside its lane.
3. Reload the preview and watch the four side by side. Which one would you put on a button? Which on a scroll-scrubbed image?

Keep it all inside the `if (!calm)` block so reduced-motion visitors get a still page.

> Open the GSAP docs' ease visualiser (search "GSAP ease visualizer") and drag the curve around. Seeing the graph makes the names stick.
