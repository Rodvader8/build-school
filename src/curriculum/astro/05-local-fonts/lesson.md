Fonts are the quiet performance and privacy problem on most sites. The classic way to add one is a line pointing at Google Fonts. It's easy, but every visitor's browser then makes a trip to another company's servers before your text can settle, and that request tells them someone visited. It's also an extra connection to set up, which costs speed on a phone.

The fix is to keep the font file in your own project, and serve it from your own site. Astro's fonts feature does the tedious parts for you.

## What the starter does wrong

Open `src/styles/site.css`. The first line is `@import url('https://fonts.googleapis.com/...')`. Delete it later. First, understand what replaces it.

## Step 1: describe each font in the config

Both font files are already committed in `src/assets/fonts`. Local fonts are `.woff2` files, the compressed format every browser supports. You tell Astro about them in `astro.config.mjs`:

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Figtree',
      cssVariable: '--font-figtree',
      display: 'swap',
      fallbacks: ['Segoe UI', 'Roboto', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/figtree-latin-wght-normal.woff2'], weight: '300 900', style: 'normal' },
        ],
      },
    },
  ],
});
```

A few things worth knowing:

- `weight: '300 900'` is a range. Figtree is a **variable font**, so one file covers every weight in between. The other font, Instrument Serif, only comes in one weight (`400`).
- `display: 'swap'` means the browser shows text straight away in a fallback font, then swaps when yours arrives.
- `fallbacks` is the stack used while that happens. Astro also generates a tuned fallback so the swap doesn't make the text jump.
- `cssVariable` is the handle you'll use in CSS.

## Step 2: put the font on the page

The config alone doesn't change any page. Add the `<Font>` component inside your layout's `<head>`:

```astro
---
import { Font } from 'astro:assets';
---
<head>
  <Font cssVariable="--font-figtree" preload />
</head>
```

At build time that writes the `@font-face` rule into the page and, because of `preload`, a `<link rel="preload">` that tells the browser to start downloading it immediately.

## Step 3: use the variable in CSS

```css
body { font-family: var(--font-figtree); }
h1 { font-family: var(--font-instrument-serif); }
```

Because the variable already contains the whole fallback stack, you don't repeat it anywhere.

## Your turn

1. Run `npm install` in the terminal below, then press **Start dev server**. Notice the text flicker if you hard-refresh: it's the borrowed font arriving late.
2. In `astro.config.mjs`, declare both fonts (`Instrument Serif` with `--font-instrument-serif`, and `Figtree` with `--font-figtree`).
3. Add a `<Font ... preload />` for each to `src/layouts/Base.astro`.
4. In `site.css`, delete the `@import` line and replace the hard-coded `font-family` values with the variables.
5. Press **Check my work**.

> Tip: only commit fonts you're allowed to. The ones in this lesson are open source (SIL OFL), which permits self-hosting. A font bought for one client's brand doesn't automatically go on another's site.
