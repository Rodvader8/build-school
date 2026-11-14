Up to now, a lesson told you when it was finished. In real work nobody does. You decide, and the client, the search engines and the next developer judge the decision. This stage is about owning that call.

So here's the standard, in one file. `gate.mjs` builds your site, serves the build, loads every page in a real browser and checks it against the rules a well-built production site should meet. "Done" means every line is a PASS. Not most of them. All.

## What the gate checks

- **It builds**, with one `h1` per page, a meta description of 120 to 160 characters, and JSON-LD that parses and says what the page is.
- **The share image is a JPG or PNG.** Facebook and LinkedIn can't read WebP, so a WebP `og:image` means a blank preview.
- **Fonts are yours.** The built CSS points at local `.woff2` files, and no page asks Google for anything. One request to a font CDN is a privacy leak and a render delay.
- **No inline `style` attributes**, in your source or in the built HTML. Classes only.
- **axe-core finds no serious or critical violations.** Contrast, names, labels, landmarks.
- **No sideways scroll** at 375, 768, 1280 and 1920 pixels wide.
- **Reduced motion works.** With `prefers-reduced-motion: reduce` switched on, nothing keeps running and nothing is left invisible waiting for an animation.
- **A Content-Security-Policy exists**, the pages load under it, and the console stays clean.
- **Lighthouse** gives accessibility and SEO at least 95, and passes three structural audits: images have a width and height, nothing blocks the first paint, and images are big enough for the space they fill.

## What it doesn't check

The Lighthouse performance score. That isn't the gate going easy on you: the number depends on the machine measuring it. A machine without a GPU scores differently from one with it, so a score here tells you about the machine. If you ever need a performance number, run Lighthouse three times and quote the **median**, never the best run. The gate sticks to things that are true or false everywhere.

## Your turn

This is Lantern Hill Pottery, an invented studio. The site is nearly finished, and it fails the gate in a dozen places.

1. Run `npm install` in the terminal, then press **Check my work**. Read the report from the top. Every FAIL has a reason underneath it.
2. Fix one failure, run it again. Start with the cheap ones (the description, the `og:image`, the second `h1`), then fonts, then the CSP, then motion.
3. The fonts are already in `src/assets/fonts`. Declare them in `astro.config.mjs` with `fontProviders.local()` and add the `Font` component to the layout, as you did in the Astro track.
4. For the CSP, add a `[[headers]]` block to `netlify.toml` with a `Content-Security-Policy` that starts from `default-src 'self'`. Change the page to fit the policy, never the reverse.
5. When every line is a PASS, run `npm run gate` once more from the terminal and read it as a stranger would. You'll run the same gate on three briefs next, with no steps at all.

> Tip: you can run the gate yourself any time with `npm run gate`. It takes about half a minute.
