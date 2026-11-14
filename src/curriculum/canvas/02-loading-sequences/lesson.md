A scroll-scrubbed hero is just a numbered set of pictures. A typical hero might use 91 frames per set, a few megabytes in all. Heavy. If you fetch them carelessly, the page that was meant to look premium scores badly in Lighthouse and feels slow on a phone.

This lesson is about the one decision that fixed it: **don't load the frames until the visitor shows up.**

## Why not just load them?

A speed test like Lighthouse loads the page and never scrolls, never taps and never moves a mouse. Every byte you fetch "just in case" costs it points, and it never gets any benefit. A real visitor on a phone connection pays too.

In one real project, this change took the download at rest from 2.4 MB to 45 KB on a throttled phone.

## The pattern

1. **At rest, load nothing, or just the opening frame.** Draw frame 0 onto the canvas so the hero isn't empty.
2. **Wait for a sign of life.** Any of `pointerdown`, `pointermove`, `touchstart`, `wheel`, `keydown` or `scroll` means a human is here.
3. **Then load the rest**, after the page's own `load` event so it doesn't compete with the page itself.

```js
const ENGAGE = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown', 'scroll'];

function onEngage() {
  ENGAGE.forEach((name) => window.removeEventListener(name, onEngage));
  if (document.readyState === 'complete') loadRest();
  else window.addEventListener('load', loadRest, { once: true });
}
ENGAGE.forEach((name) => window.addEventListener(name, onEngage, { passive: true }));
```

Remove the listeners the first time any of them fires, or the second one will start a second load. `passive: true` promises the browser you won't block scrolling, which keeps scrolling smooth.

## A promise per frame

```js
function loadFrame(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = framePath(i);
    sequence[i] = img;
  });
}
```

`new Image()` creates a picture that isn't on the page. Setting `src` starts the download. `onload` fires when it's ready, and the promise hands it back. You'll use these images as the canvas's paint.

## The LCP trap

LCP, **Largest Contentful Paint**, is the time until the biggest thing on screen appears. A canvas drawing can never be the LCP. A big `<img>` can. In one project, a full-width phone *poster* image was added to help the page look ready sooner, and it became the LCP element and made the score worse (1.1 seconds to 1.5-2.5 seconds). It was removed again.

So the rule here: the first frame is drawn into the canvas, not placed as a poster `<img>`. The check will flag any `<img>` on the page.

> There's no shortcut around measuring. A change that "should" help can make it worse. Test a production build, a few times, before you believe it.

## Your turn

1. Write `loadFrame(i)`: make an `Image`, store it in `sequence[i]`, and return a Promise that resolves with the loaded image.
2. At rest, load frame 0 only, and draw it with `drawImage` when it arrives. Delete the loop that loads everything.
3. Write `loadRest()` to load frames 1 to 47, once only.
4. Wait for the first sign of life on `window`, then (after `load`) call `loadRest()`.

Check the Network tab in the browser's dev tools to see when each frame is requested. Open the preview on its own and try it.
