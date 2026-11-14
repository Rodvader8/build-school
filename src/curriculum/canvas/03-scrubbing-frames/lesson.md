Here's the whole trick of a scroll-scrubbed hero, and it's shorter than you'd expect. Scrolling doesn't move anything. It's a **playhead**. Scroll position becomes a number, the number picks a frame, and the canvas draws that frame.

You already have every piece: a canvas you can draw into (lesson 1), the frames loaded (lesson 2), and a scrubbed, pinned ScrollTrigger (GSAP lesson 6).

## A number to animate

GSAP can tween any number on any object. So make one:

```js
const state = { frame: 0 };

gsap.to(state, {
  frame: 47,
  ease: 'none',
  snap: 'frame',
  onUpdate: render,
  scrollTrigger: { trigger: '.cv-hero', start: 'top top', end: '+=300%', pin: true, scrub: true },
});
```

As you scroll through the pinned hero, `state.frame` runs from 0 to 47. `scrub: true` ties the tween to the scroll bar: half way down, `state.frame` is about 23.5. Scroll back, and it runs backwards for free.

- `ease: 'none'`, because the scroll bar is the easing. A curve here would make the sun speed up and slow down for no reason.
- `snap: 'frame'` rounds that value to a whole number, because there's no such thing as frame 23.5. (Lesson 4 comes back to this, and shows how to blend between two frames instead.)
- `onUpdate: render` calls your drawing function every time the number changes.

## The drawing function

```js
function render() {
  shownFrame = Math.round(state.frame);
  drawFrame(shownFrame);
}
```

It's tiny on purpose. `render()` takes no scroll maths at all. It only knows "draw this frame". The ScrollTrigger decides which one.

> `shownFrame` is kept in a variable for a reason: it's what the lesson checks read, and on a real project it's what your tests and your debugging read too. When you can't see why a frame is wrong, being able to type `shownFrame` into the console beats guessing.

## How long should the scroll be?

`end: '+=300%'` means three screens of scrolling to play 48 frames: about 16 frames per screen. Too short and the sunrise whips past. Too long and the visitor gets bored and leaves. One production desktop hero uses about 2.3 screens, and "slightly slower" was a deliberate tweak after trying it.

## Reduced motion

Showing the **last** frame is the right answer: it's the finished picture, so the page makes sense with no motion at all. The check reads that you did it.

## Your turn

1. Make `const state = { frame: 0 }`.
2. Write `render()` so it stores the whole frame number in `shownFrame` and draws it.
3. For reduced motion: set `state.frame` to the last frame, render, and stop. (The last frame may not have arrived yet, so also draw it when it loads.)
4. Otherwise, tween `frame` to `TOTAL - 1` with `ease: 'none'`, `snap: 'frame'`, `onUpdate: render` and a pinned, scrubbed ScrollTrigger on `.cv-hero`.

Scroll the preview. Does the sun rise as you go, and set again when you scroll back?
