A well-built site behaves differently depending on who's looking. Willow Cove is pinned and choreographed on a laptop, simpler on a phone, and completely still for anyone who's asked their device for less motion. Three experiences, one script.

Until now you've checked `matchMedia(...).matches` once, at page load. That works, until someone rotates their phone or drags the window narrower. Then your pinned section is still pinned on a screen it doesn't fit.

## gsap.matchMedia

```js
const mm = gsap.matchMedia();

mm.add('(min-width: 900px)', () => {
  // everything created in here only exists while the screen is wide
});
```

GSAP watches the media query for you. When it stops matching, everything you created inside, every tween and every ScrollTrigger, is **reverted** (put back exactly as it was). When it matches again, your function runs again. No manual cleanup, and no half-pinned page after a rotation.

## Several conditions at once

Name them in an object, and read which ones are currently true:

```js
mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)', calm: '(prefers-reduced-motion: reduce)' }, (context) => {
  const { wide, calm } = context.conditions;

  if (calm) return;        // nothing animates
  if (wide) { /* pinned version */ } else { /* phone version */ }
});
```

This is a pattern worth following everywhere: reduced motion first (the quiet exit), then wide, then everything else.

One trap: GSAP only runs your function when **at least one** condition matches. If you named just `wide` and `calm`, a phone with no reduced-motion setting matches neither, and the function never runs. Give the small screen its own condition (`narrow`), and every visitor lands somewhere.

## Your own mess

GSAP reverts **its own** work. It knows nothing about a class you added with `classList.add`, so the pinned layout would stay on after the pin was gone. Return a cleanup function and matchMedia calls it when the conditions change:

```js
return () => band.classList.remove('is-pinned');
```

Return the *function*, not the result of calling it. This is the most common slip.

## Reduced motion, properly

`prefers-reduced-motion: reduce` is the one query you should always support. Remember it isn't about banning movement. Fades and gentle colour changes are usually fine. What it protects people from is large-scale motion: parallax, pins, things zooming and sliding across the whole screen. If in doubt, make the calm version the plain page, as here, and let everyone read it.

## Your turn

1. Make `gsap.matchMedia()` with one function and three named conditions: `wide`, `narrow` and `calm`.
2. Calm: return straight away.
3. Wide: add `is-pinned`, then slide `.gs-band__text` left with `xPercent: -55` on a scrubbed, pinned ScrollTrigger (`'top top'` to `'+=100%'`).
4. Otherwise: fade the `.gs-fade` cards up with a stagger as `.gs-fades` arrives.
5. Return a cleanup that removes `is-pinned`.

Drag your preview's width across 900px and watch the page switch with no reload. The checks do exactly that.
