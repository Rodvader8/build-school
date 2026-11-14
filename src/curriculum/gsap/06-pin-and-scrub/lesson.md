This is the effect that makes a page feel like a film. Larkfield's "how we work" section **pins** to the screen while you keep scrolling, and the scroll bar becomes a playhead that moves a story through three chapters. Stop scrolling and it stops. Scroll back and it rewinds.

Two options on ScrollTrigger do all of it.

## `pin: true`

```js
scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', pin: true }
```

When the top of the section reaches the top of the screen (`'top top'`), GSAP holds it in place. It keeps holding for `'+=300%'`, which means "300% of the viewport height past the start": three screens of scrolling. Then it lets go and the page carries on. GSAP wraps the section in a `pin-spacer` element to keep the page length right, which is why you'll see an extra wrapper in the inspector.

## `scrub`

By default a ScrollTrigger *plays* an animation when you cross a line. With `scrub` it *ties* the animation to the scroll position instead: scroll 40% of the way and the animation sits at 40%.

- `scrub: true` follows the scroll bar exactly.
- `scrub: 1` catches up over one second, which smooths out jerky mouse-wheel scrolling. Many production sites use this.

Scrubbed tweens should almost always use `ease: 'none'`. The scroll bar is already doing the easing, and adding more makes it feel laggy.

## The timeline is a ruler

When you scrub a timeline, its length in seconds doesn't mean seconds at all. It's a ruler, and the scroll distance gets stretched across it. A 5 second timeline over 3 screens of scroll puts chapter changes at 1s and 3s of that ruler, so each chapter gets its moment and each crossfade is a short stretch of scrolling.

Hold a state by adding empty time: `.to({}, { duration: 1 })` pads the end so the last chapter stays put.

## Stacking, only when it's needed

Look at the CSS. By default the chapters are a plain stack, which is the right answer for phones and for people who've asked for less motion. JavaScript adds the class `is-pinned` only when the pinned version will actually run, and the CSS layers the chapters on top of each other then. That's the same approach as the `nm-pin` class on Larkfield.

## Your turn

1. Add `is-pinned` to the section and hide chapters 2 and 3 with `gsap.set(..., { autoAlpha: 0 })`.
2. Build a timeline with a ScrollTrigger: `start: 'top top'`, `end: '+=300%'`, `pin: true`, `scrub: 1`, and `ease: 'none'` as the default.
3. Crossfade chapter 1 to 2 at 1 second, and 2 to 3 at 3 seconds. Pad the end with one empty second.

Scroll the preview and watch the section hold still while the chapters change.

> Resize the preview narrower than 900px and reload. No pin, no JavaScript layout, just a readable page.
