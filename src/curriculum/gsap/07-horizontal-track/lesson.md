Anchorline, the business insurance example, has a section where you scroll *down* and the industries slide *sideways*. You never touch a horizontal scroll bar, so there's no hidden content for someone to miss. It's one of the most requested effects there is, and it's a short recipe once you've done the pin from lesson 6.

## The idea

1. A wide **track** holds every card in a row. It's wider than the screen.
2. The section around it is **pinned**, so the screen stays still.
3. As you scroll down, the track moves left, by exactly the amount that hides.

The tween is a single line:

```js
gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { ... } });
```

`ease: 'none'` again, because the scroll bar is the easing.

## How far?

The track needs to travel its own width, minus the one screen already visible:

```js
const distance = () => track.scrollWidth - window.innerWidth;
```

Write it as a **function**, not a number, because the answer changes whenever the window does. Both the `x` value and the `end` use it:

```js
scrollTrigger: {
  trigger: section,
  start: 'top top',
  end: () => '+=' + distance(),
  pin: true,
  scrub: 1,
  invalidateOnRefresh: true,
}
```

- `end: () => '+=' + distance()` makes the scroll length match the sideways length, so the cards slide at the same speed as the scroll bar. Too short and it feels like a rocket. Too long and it drags.
- `invalidateOnRefresh: true` tells ScrollTrigger to call those functions again when the page is re-measured (a resize, a rotated phone, a late-loading font).

## The accessible fallback

Look at the CSS. Without JavaScript, the section is a normal row you can swipe, with scroll-snap for tidy stops. JavaScript only takes over when `wide && !calm`, adding `is-pinned`, which hides the overflow so the transform can do the moving. If the effect doesn't run, nobody loses anything.

> A pinned section with `overflow-x: hidden` on a parent can silently stop pinning on some browsers. If a pin ever refuses to hold, check the parents for overflow before you check anything else. Lesson 5 of the Canvas track hits this same trap.

## Your turn

1. Add `is-pinned` to the section.
2. Tween the track's `x` to `-distance()`, as a function, with `ease: 'none'`.
3. Give it a ScrollTrigger: `start: 'top top'`, `end: () => '+=' + distance()`, `pin: true`, `scrub: 1`, `invalidateOnRefresh: true`.

Scroll the preview and watch the cards go sideways. Then drag the preview's width and reload to see it re-measure.
