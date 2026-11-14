Desktop is the easy half. On a phone, a scroll-scrubbed hero can easily go wrong three times before it works: the scene sat behind the buttons, then it was hidden by the section below, then it played underneath the buttons where nobody could see it. This project is the version that worked, using notes from real debugging. It's also the Canvas track's capstone: the loader from lesson 2 and the scrub from lesson 3 are already in the starter, and you build the part that failed.

## Pin with CSS, not JavaScript

On phones, use `position: sticky` instead of ScrollTrigger's `pin`:

```css
.cv-hero { height: calc(100svh + var(--travel, 0px)); }
.cv-hero__inner { position: sticky; top: 0; min-height: 100svh; }
```

The hero is tall (one screen plus the *travel*, the scroll distance the frames play over), and the inner box sticks to the top while you scroll through that extra height. ScrollTrigger doesn't pin anything. It just reads how far through the section you are, as a number from 0 to 1. Fewer moving parts, and no pin-spacer to confuse mobile browsers.

## The sticky trap

Here's the one that will cost you an afternoon if you don't know it. **`position: sticky` silently stops working if any ancestor has `overflow-x: hidden`** (or `auto` or `scroll`). That ancestor becomes a scroll container, and sticky sticks to *its* edges, not the page's. Nothing errors. It just scrolls away.

Sites often put `overflow-x: hidden` on a wrapper to stop sideways scrolling. Use **`overflow-x: clip`** instead: it hides the overflow without making a scroll container. (GSAP lesson 7's pinned track hits the same trap.) Look at `.cv-shell` in the starter's CSS.

## Fit the scene under the copy

On a short phone, there's only so much room under the text. Measure it, don't guess:

```js
const copyBottom = copy.getBoundingClientRect().bottom - inner.getBoundingClientRect().top;
const room = window.innerHeight - copyBottom - GAP - 16;
hero.style.setProperty('--scene-h', `${Math.max(120, Math.floor(room))}px`);
```

CSS turns `--scene-h` into the scene's width and height. Then call `resize()` (the canvas has changed size), redraw, and `ScrollTrigger.refresh()` so it re-reads the hero's new height.

## Re-measure on width only

```js
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  layout();
});
```

On a phone, the browser's address bar slides away as you scroll, and the window *height* changes with it, many times. If you re-lay out on each one, the scene jumps under the visitor's thumb. Rotation and real resizes change the width, so that's the signal to act on.

## Performance, the short version

You've already built the big win: don't download the frames until someone is actually there. The rest is discipline:

- A canvas can't become the LCP. A big poster `<img>` can.
- Remove listeners and cancel work when you're done with them.
- Measure a **production** build, a few times, with throttling. Never trust one run, and never trust the dev server.

## Your turn

1. In `style.css`, make `.cv-hero__inner` sticky (`position: sticky; top: 0`), and fix the `.cv-shell` overflow so it works.
2. Write `layout()` to set `--scene-h` and `--travel`, then resize, redraw and refresh.
3. Call `layout()` once, and again on resize **only if the width changed**.

Press Check my work: it resizes the preview to a phone for you. Then narrow the preview by hand and scroll through the hero yourself. That feel is the point.
