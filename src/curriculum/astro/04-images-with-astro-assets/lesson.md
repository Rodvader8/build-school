Images are usually the heaviest thing on a page, and the single biggest reason a good-looking site scores badly in Lighthouse. Astro's `astro:assets` module fixes most of it for you at build time: it resizes, converts to modern formats, and writes the `width` and `height` the browser needs to reserve space.

## public versus src/assets

There are two places an image can live, and they behave very differently.

- `public/hero.jpg` is copied to the site **untouched**. You link to it with `<img src="/hero.jpg">`. The visitor gets the full file, whatever their screen.
- `src/assets/hero.jpg` is **processed**. You import it, hand it to a component, and Astro makes the right files.

```astro
---
import { Picture } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Picture src={hero} formats={['avif', 'webp']} widths={[480, 800, 1200]} sizes="100vw" alt="..." />
```

Because you imported the file, Astro knows its real dimensions and writes `width` and `height` onto the tag. That stops the page jumping as the image arrives (it's what Lighthouse calls layout shift).

## Picture and Image

`<Picture>` builds a `<picture>` element with a `<source>` per format and several widths, so a phone downloads a 480-pixel AVIF while a big desktop screen gets the 1200-pixel one. **AVIF** is the smallest, **WebP** is the safety net, and the original JPG is the last fallback.

`<Image>` makes one plain `<img>` in one format at one size. It's the right tool for smaller pictures that don't need a full responsive set.

Two attributes matter for speed:

- Above the fold (your hero): `loading="eager" fetchpriority="high"`.
- Everything lower down: `loading="lazy"`.

## The one image that must stay a JPG

When someone shares your page, Facebook, LinkedIn and messaging apps read the `og:image` tag to pick the preview picture. They don't all understand WebP or AVIF, so that one picture should always be a **JPG or PNG**, with an absolute URL. `getImage` makes one for you:

```astro
---
import { getImage } from 'astro:assets';
const share = await getImage({ src: hero, format: 'jpg', width: 1200, height: 630 });
---
<Base ogImage={share.src} ... />
```

The layout turns `share.src` into a full address using the `site` setting in `astro.config.mjs`.

## Your turn

1. Run `npm install` in the terminal below, then press **Start dev server**. The page works, but it's serving full-size files.
2. In the terminal, move the two images: `mkdir -p src/assets && mv public/*.jpg src/assets/`
3. Open `src/pages/index.astro`. Import both images, and swap the hero for a `<Picture>` (AVIF and WebP, three widths, eager and high priority).
4. Swap the oven photo for an `<Image>` (width 800, WebP, lazy).
5. Make the share image with `getImage` and pass it to the layout as `ogImage`.
6. Press **Check my work**. Then open the page's **Network** tab in your browser's DevTools and see the size of what the hero sends.

> Tip: always keep `alt` text on every image. It's the description a screen reader reads out, and it's what shows if the picture fails to load.
