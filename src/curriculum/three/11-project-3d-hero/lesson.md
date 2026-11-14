This is the capstone: a hero section for a premium site, with a live 3D crystal that dollies in as you scroll and drifts towards the pointer. Every earlier lesson is in here. What makes it a *project* instead of a demo is the part nobody sees, which is what happens when the 3D can't or shouldn't run.

## The rule: the page works without the 3D

A real-time scene costs about 120KB of JavaScript, plus battery. It has to earn that. So build in this order:

1. **The fallback is the product.** A poster image, the headline and the button, all real HTML, and a good-looking page on their own. Give the image `width`, `height` and meaningful `alt`.
2. **The 3D is an upgrade** that replaces the poster once the first frame is drawn.

The headline never waits on WebGL, which keeps your Largest Contentful Paint honest.

## Deciding the mode

Two things send a visitor to the fallback: they've asked for reduced motion, or their browser can't make a WebGL context.

```js
const mode = !calm && hasWebGL() ? 'three' : 'static';
```

In `static` mode, **don't load Three.js at all**. That's the whole point of the dynamic import:

```js
const THREE = await import('three');   // only runs on the 'three' path
```

A normal `import` at the top of the file would download it for everyone.

## Start late

Don't compete with the headline for the main thread. Start the scene on `requestIdleCallback`, *and* add a `setTimeout`, because idle callbacks can sit waiting forever in a background tab and leave a bare poster. A `started` flag stops both from running it.

## The pieces you already know

- **Scroll dolly (lesson 8):** one `progress` number from the scroll, eased towards its target, driving the camera. Here progress is `scrollY` divided by the hero's height, so the move finishes when the hero leaves.
- **Pointer parallax (lesson 7):** the pointer, scaled to -1 to 1, nudges the camera a little.
- **Delta time and easing (lesson 4):** `1 - Math.exp(-5 * delta)` everywhere.
- **Performance (lesson 10):** pixel ratio capped (1.75 is a common cap), an `IntersectionObserver` plus `visibilitychange` deciding if the loop runs, and a `destroy()` that disposes everything.

## Layout from the element, not the window

Size the renderer from `canvas.clientWidth` and `clientHeight`. The canvas fills the hero, whatever the screen is, and it's the same lesson production heroes learn about never positioning against one viewport width.

## Your turn

Open `main.js`. The scene is built for you in `buildScene(THREE)`. Work through the numbered comments:

1. Decide `mode`, set `window.__heroMode`, and add `is-3d` or `is-static`.
2. Write `startThree()`: dynamic import, renderer, `layout()`, state, `update(delta)`, listeners, the gated loop, `destroy()`, and the hand-off from poster to canvas.
3. Start it on idle with a timer fallback, once only.

> To see the fallback yourself, turn on "reduce motion" in your system settings and reload. You should get the poster and no 3D download.
