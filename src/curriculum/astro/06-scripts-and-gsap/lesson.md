Astro sends no JavaScript by default, which is a big reason Astro sites are fast. When you do need some, say for a scroll animation, you add it deliberately, to the pages that need it and no others.

## Scripts in an .astro file

A plain `<script>` tag in an `.astro` file is **bundled**. Astro finds its imports, includes the code they need, minifies it and writes it to `dist/_astro/`. The page then loads it as a module:

```astro
<script>
  import '../scripts/home.js';
</script>
```

Because the tag lives in `index.astro`, only the home page loads it. The about page, with no script tag, ships none. Compare that with a site that loads one giant `main.js` everywhere.

Two tags look similar but behave differently:

- `<script>` is processed and bundled. Use this by default.
- `<script is:inline>` is copied as written, exactly like plain HTML. It's for tiny snippets that must run before anything else (a theme flag, say), and it can't import anything.

## GSAP from npm, not a CDN

The starter loads GSAP with `<script src="https://cdn.jsdelivr.net/...">`. That works, but your page now depends on someone else's server being up, and it adds a connection to a third party. GSAP is on npm, so install it:

```
npm install gsap
```

That records it in `package.json`, and then you import it like any module:

```js
import gsap from 'gsap';
gsap.from('.reveal', { opacity: 0, y: 24, duration: 0.8, stagger: 0.15 });
```

For scroll effects you'd also `import { ScrollTrigger } from 'gsap/ScrollTrigger';` and call `gsap.registerPlugin(ScrollTrigger)`. It's the same pattern used in the GSAP track.

## Respect reduced motion

Some visitors have asked their device to cut back on movement, because it can make them unwell. Browsers expose that as a media query, and your script should honour it:

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  gsap.from('.reveal', { opacity: 0, y: 24 });
}
```

If it's true, you skip the animation and the page just shows up in its final state. That's only safe because the content is visible by default. Never hide something in CSS and count on JavaScript to reveal it: `gsap.from()` sets the starting opacity itself, when it runs.

## Your turn

1. Run `npm install` in the terminal below. Then run `npm install gsap` to add the animation library.
2. Press **Start dev server** and watch the cards fade up. Visit the About page too.
3. Create `src/scripts/home.js` with the GSAP import, the reduced-motion check and the `gsap.from` call.
4. In `src/pages/index.astro`, delete both inline CDN scripts and add a `<script>` that imports your file.
5. Press **Check my work**. Then look in `dist/_astro` after a build: GSAP is in there, and the about page references no script at all.

> Tip: in Chrome DevTools, open the Rendering panel and set "Emulate CSS media feature prefers-reduced-motion" to see your reduced-motion path without changing your system settings.
