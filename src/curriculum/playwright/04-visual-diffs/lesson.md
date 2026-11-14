Imagine you've upgraded a framework, changed a dependency or tidied some CSS and you're about to ship. The question is: did anything on the site change by accident? Checking every page by eye at four widths is tedious, and tired eyes miss a button that moved 3 pixels. A **visual diff** does it for you: it takes a "before" and an "after" screenshot and highlights every pixel that's different.

## How a pixel diff works

A screenshot is a grid of pixels, each one a red, green, blue, alpha value. Compare two same-sized grids pixel by pixel and count the ones that differ. The tool is **pixelmatch**, a small library, and **pngjs** reads and writes PNG files.

```js
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const a = PNG.sync.read(bufferA);
const b = PNG.sync.read(bufferB);
const out = new PNG({ width: a.width, height: a.height });
const diffPixels = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.1 });
```

`out` becomes a picture with the differences painted red, ready to save as `diff.png`.

## Thresholds: not every difference matters

Two screenshots of the *same* page are rarely identical to the last bit. Text gets anti-aliased slightly differently, and gradients dither. If you flagged every tiny colour wobble, you'd drown in false alarms. That's what `threshold` is for: how different two colours must be before they count (0 is "any difference", 1 is "never"). `0.1` is a good starting point. It ignores the invisible and catches the real.

There's a second dial: **how much change is acceptable overall.** Use a ratio of changed pixels to all pixels, such as `MAX_RATIO = 0.001`, which means 0.1% of the picture. Above that, call it "changed".

## Make the screenshots repeatable

A diff is only useful if the same page always gives the same picture. So:

- **Same viewport every time** (here 1280 by 800).
- **`animations: 'disabled'`** so nothing is caught mid-fade.
- **`caret: 'hide'`** so a blinking text cursor can't differ.
- **Wait for fonts**: `await page.evaluate(() => document.fonts.ready)`.
- **Block analytics** as always, so no stray widgets pop up.

And when the two images are **different sizes**, a pixel diff can't compare them, so say so clearly. A page that has suddenly grown 400 pixels taller is itself a finding.

## Your turn

`pages/before.html` and `pages/after.html` are two versions of a page. In `pages/almost.html` a colour changed by a shade nobody could see.

1. Open `diff.mjs` and write `compareImages(bufferA, bufferB, { threshold })`. It returns `{ width, height, diffPixels, ratio, diffPng }`, or `{ sizeMismatch: true }` when the sizes differ.
2. Open `visual-diff.mjs`. Take both screenshots properly, then decide the verdict from `ratio` and `MAX_RATIO`.
3. Try it: `node visual-diff.mjs pages/before.html pages/after.html`, then open `diff.png`. Try `pages/before.html pages/almost.html` as well.
4. Press **Check my work**.
