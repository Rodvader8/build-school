This is the technique behind the scroll-driven 3D hero you see on many showcase sites: the page scrolls normally, and the camera flies through a scene as you go. The scroll bar becomes a playhead. It's the same idea as the GSAP pin-and-scrub lesson, but the thing being scrubbed is a 3D camera.

## The page stays a normal page

Notice what's *not* happening. Nothing is pinned, and the scroll isn't hijacked. The canvas is `position: fixed` behind the page, and the text is ordinary HTML in sections on top of it. That matters for three reasons: the words stay selectable and readable by screen readers, the page works if WebGL fails, and the browser's own scroll physics stay intact.

## Progress is one number

Everything flows from a single value, scroll progress from 0 to 1:

```js
const max = document.documentElement.scrollHeight - innerHeight;
const progress = max > 0 ? scrollY / max : 0;
```

Divide by the distance you *can* scroll, which is the page's height minus one screen, not by the page height itself. Otherwise it never reaches 1.

## A path for the camera

A `CatmullRomCurve3` draws a smooth curve through the points you give it. Ask it for a spot and you get a `Vector3`:

```js
camera.position.copy(path.getPointAt(progress));
camera.lookAt(0, 1, -20);
```

`getPointAt` spaces things by distance, so progress 0.5 is halfway along the *length*. The plain `getPoint` goes by point index, which makes the camera speed up and slow down for no reason. Choose it only on purpose.

## Smoothing

Mouse wheels move in steps, so a camera glued straight to `scrollY` looks jittery. The fix is to chase the target instead of copying it:

```js
smoothed += (target - smoothed) * (1 - Math.exp(-6 * delta));
```

That `exp` form works the same at any frame rate. The older `lerp(a, b, 0.1)` per frame feels different on a 144 Hz screen, which is lesson 4's lesson again.

## Traps from real builds

- **Store, don't act, in the scroll listener.** Set `target` and stop. The loop moves the camera once per frame.
- **Mark the listener `{ passive: true }`** so the browser never waits on your code before it scrolls.
- **Derive layout from the camera,** never from one fixed window width. The starter's `resize()` keeps the aspect right.
- **Start in the right place.** Run one `update(10)` at load so a reload halfway down the page doesn't make the camera swoop from the top.
- **Keep the copy in the DOM** and make the final frame work by itself. A visitor who never scrolls still sees it.

## Calm mode

Camera motion tied to scrolling is exactly the kind of movement the reduced-motion setting is for. So when `calm` is true, skip the listener and the loop, put the camera at its final, composed position with `place(1)`, and draw once.

## Your turn

1. Write `scrollProgress()`.
2. Build the `CatmullRomCurve3` path through the four points in the comments.
3. Write `place(t)` and `update(delta)` with the smoothing.
4. Calm: place the camera at the end and draw once. Otherwise add the passive scroll listener, call it once, and start a loop that calls `update`.

Scroll the preview and the camera should glide down the corridor.
