Many polished sites, Larkfield included, move with GSAP. At its core it does one job: take a property (position, opacity, size, colour) and change it smoothly from one value to another over time. That change is called a **tween**, short for "in-between".

GSAP is already loaded on this page with a `<script>` tag, so the `gsap` object is ready to use.

## Three ways to say it

```js
gsap.to('.box', { x: 200, duration: 1 });
```

**`to`** animates from wherever the element is now *to* the values you give. Here that's 200px to the right over one second.

```js
gsap.from('.box', { y: 40, opacity: 0, duration: 1 });
```

**`from`** is the reverse. The values you give are where it *starts*, and it finishes where your CSS left it. This is the one you'll use most for page-load reveals, because your stylesheet stays the honest, finished version of the page.

```js
gsap.fromTo('.box', { opacity: 0 }, { opacity: 1, duration: 1 });
```

**`fromTo`** spells out both ends. It's the safest when the start must be exact, and you'll meet it again when scrolling takes over.

## Things worth knowing

- The first argument is a CSS selector, an element, or a list of them. A selector that matches three cards animates all three.
- `x` and `y` move an element with a transform, so the layout doesn't shift. Prefer them over `left` and `top`.
- `duration` is in seconds, not milliseconds. `delay` waits before starting.
- `repeat: -1` loops forever, and `yoyo: true` plays it backwards on each repeat.

## Reduced motion, from the very start

Some people feel sick when a page moves a lot. They tell their device so, and CSS and JavaScript can both read that:

```js
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calm) { /* animate */ }
```

Because `from` tweens finish where your CSS already is, skipping them means the finished page just appears. Nothing is lost. Lesson 11 gives you a tidier tool for this.

## Your turn

1. Make the headline arrive with `gsap.from`: start 40px low and invisible, over 1 second.
2. Give the button a pulse with `gsap.to`: scale to `1.06` over 0.8 seconds, repeat forever, with `yoyo`.
3. Reveal the three cards with `gsap.fromTo`: from `y: 60, opacity: 0` to `y: 0, opacity: 1`.

Keep all three inside the `if (!calm)` block, then press reload above the preview to replay.

> Open the page and look at the headline: it's exactly where your CSS put it. GSAP only borrowed it for a second.
