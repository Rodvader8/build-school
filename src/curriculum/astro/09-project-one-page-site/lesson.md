This is the whole course in one go. You'll build a complete one-page site for an invented business, **Harbourlight Roasters**, a small coffee roastery. It's the shape of a typical premium service site: a content file, a layout, a handful of sections, optimised images, local fonts, a touch of motion and the search signals underneath.

You won't write any CSS. A ready-made `src/styles/site.css` is in the project, and your job is to produce markup that uses its class names. You also don't invent any words: every sentence is in `src/data/brand.ts`.

## What's already there

- `src/data/brand.ts`: the whole brand, typed. Headline, services, steps, reviews, FAQs, hours and contact details.
- `src/assets/fonts`: DM Serif Display and Figtree, as `.woff2` files.
- `src/assets/img`: `hero.jpg` and `roastery.jpg`.
- `public/og.jpg`: the share image, ready to use.
- `package.json`: Astro and GSAP, both pinned.

## The build, in order

Work through it in layers and press **Check my work** after each, so you always know which layer broke something.

1. **Layout and head** (`src/layouts/Base.astro`). Props for `title` and `description`. Add the canonical link, Open Graph tags (the `og:image` is `https://harbourlight.example/og.jpg`), the JSON-LD (type `CafeOrCoffeeShop`, suburb-only address, opening hours, all built from `brand`) and the two `<Font>` components. See lessons 1 and 8.
2. **Fonts** (`astro.config.mjs`). Declare both with `fontProviders.local()`. The CSS expects the variables `--font-display` for DM Serif Display and `--font-body` for Figtree. See lesson 5.
3. **The page** (`src/pages/index.astro`). One `<h1>` (the headline), then five `<section>` elements with the ids `services`, `process`, `reviews`, `faqs` and `contact`. Use `.map()` over each list in the data. The FAQs are `<details>` with a `<summary>`, so they open and close with no JavaScript. See lessons 2 and 3.
4. **Images**. A `<Picture>` hero (AVIF and WebP, three widths, eager, high priority), and a lazy `<Picture>` for the roastery. Use the alt text from the data. See lesson 4.
5. **Motion** (`src/scripts/home.js`). Import GSAP, check `prefers-reduced-motion`, and animate the elements with the `reveal` class. Load it from a `<script>` in the page. See lesson 6.
6. **Files in `public`**: `llms.txt` and `robots.txt`.

## Your turn

1. Run `npm install` in the terminal below, then press **Start dev server**. You'll see a placeholder.
2. Work through the six layers above, checking as you go.
3. When everything's green, change one thing in `brand.ts`, say the headline or a phone number, and watch the page, the schema and the nav all follow. That's the payoff of keeping content in data.
4. Run `npm run build`, then open the files in `dist/`. Find the `.avif` images, the fonts and the one small script.

> Tip: if a check message isn't enough, open `check.mjs` in the Explorer. It's about a hundred lines of plain Node, and it shows exactly what's being looked for in `dist/`.
