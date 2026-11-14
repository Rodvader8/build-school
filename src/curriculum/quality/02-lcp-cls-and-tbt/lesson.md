Core Web Vitals are three numbers Google uses to judge how a page feels. They're also the things a client notices: "it's slow", "it jumps around", "I tapped and nothing happened". In this lesson you fix all three on a deliberately bad page.

| Metric | Plain meaning | Healthy |
|---|---|---|
| **LCP** (Largest Contentful Paint) | When the biggest thing in view finished appearing, usually the hero image | under 2.5 s |
| **CLS** (Cumulative Layout Shift) | How much stuff moved after you started reading | under 0.1 |
| **TBT** (Total Blocking Time) | How long the page was too busy to respond to a tap | under 200 ms |

Start the dev server and open the page. The hero arrives late and everything below it jumps down. That one picture is behind two of the three problems.

## LCP: tell the browser what matters

The browser discovers the hero image only after it has read the HTML and the CSS. Three small changes get it fetched early:

```html
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high" />
<img src="/hero.jpg" fetchpriority="high" width="1600" height="800" alt="..." />
```

- **Never lazy-load the hero.** `loading="lazy"` is for images below the fold. On the main image it tells the browser to wait.
- **`fetchpriority="high"`** says this image comes before the rest.
- **A preload** lets the browser start the download while it's still reading the head.

## CLS: reserve the space

An `<img>` with no size takes up nothing until the file arrives, then shoves everything below it down. Give every image `width` and `height` attributes with its real pixel size. Combined with `height: auto` in your CSS, the browser works out the aspect ratio and holds the space open from the start. Fonts, banners and embeds that appear late do the same thing, so reserve room for them too.

## TBT: don't hog the main thread

JavaScript runs on the same thread that handles taps and scrolling. A script that works for 400 ms straight leaves the page frozen for 400 ms. Two fixes:

1. **Don't block rendering.** A plain `<script src>` in the head stops the page from painting until it's downloaded and run. Add `defer` and it waits until the HTML is parsed.
2. **Break up long work.** Anything over 50 ms counts as a *long task*. Do the work in small slices and hand control back between them:

```js
function step() {
  doSomeWork();            // 20ms of it
  if (more) setTimeout(step, 0); // let the browser breathe, then continue
}
```

The widget in this lesson only pretends to work (it just waits), but the shape is exactly what you'd do with a real search index or chat bubble.

## Your turn

Check my work loads your page in a real browser, with the hero image arriving 400 ms late. It measures with `PerformanceObserver`, the same API Chrome's own tools use, and then runs Lighthouse's structure audits.

1. In `site/index.html`, fix the hero image: no lazy loading, `fetchpriority="high"`, and a preload link in the head.
2. Give both images their real `width` and `height`. The hero is 1600 by 800 and the work photo is 800 by 500.
3. Add `defer` to the widget script.
4. In `site/widget.js`, turn the single 400 ms block into 20 ms slices.
5. Press **Check my work**.
