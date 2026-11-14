On Brightwater, the boutique hotel example, one scroll walks you through a whole day. The page starts in peach dawn light, goes pale blue by lunch, warms to clay at sunset and ends in deep navy. Nothing jumps. The colour is simply wherever the scroll bar says it should be.

It's the same scrubbed timeline as lesson 6, with one new idea: animating **colours** and **CSS variables**.

## GSAP understands colour

Give a tween a colour and it blends it for you, in any format you like:

```js
gsap.to('.box', { backgroundColor: '#1a2748' });
```

It reads what the colour is now, and eases to the new one.

## Animate a custom property

A whole theme can shift if your CSS is built on variables. Put the colours in custom properties, let the stylesheet use them, and animate the properties:

```css
.gs-day { --day-bg: #f6d7b8; background-color: var(--day-bg); }
```

```js
gsap.to(day, { '--day-bg': '#bfe3f2' });
```

Because one property can feed lots of things (the background, the sun, a border, a gradient), a single tween shifts the lot. Setting custom properties from JavaScript is the one kind of styling that belongs in script, because the stylesheet still decides what each variable *does*.

## Sticky instead of pinned

You don't always need `pin: true`. If the section is tall and its content is `position: sticky; top: 0`, the browser holds the content for you, and ScrollTrigger only has to scrub. Set the trigger to run from `'top top'` to `'bottom bottom'` and the animation spans the whole tall section. Fewer moving parts, and no pin-spacer. The Canvas track uses this approach for phones.

## Colour takes care

- Blend between colours of similar *lightness* where you can. Going straight from a bright sky to deep navy passes through a muddy grey. That's why Brightwater adds a **sunset** stop of warm clay between afternoon and dusk. A third stop is often the whole secret.
- Never put text straight on the shifting background. The card has a dark, semi-transparent panel behind its text, so it stays readable at every point on the journey. Scrub slowly, and check the worst moment, not the best.
- Reduced motion: the CSS holds the dawn values, so a visitor with reduced motion gets a calm, still page.

## Your turn

1. Build a timeline with `defaults: { ease: 'none', duration: 1 }` and a scrubbed ScrollTrigger across the whole section (`'top top'` to `'bottom bottom'`, `scrub: 1`).
2. Add three steps: noon, sunset and dusk, each setting `'--day-bg'` and `'--day-sun'` to the colours in the starter comments.
3. Tween the sun up (`y: -260`) at the start and down (`y: 120`) at 2 seconds.

Scroll slowly and watch the sky. If you spot a muddy moment, try adjusting a colour stop.
