Images are usually the heaviest thing on a page, and fonts are the thing most likely to make it jump around as it loads. Next.js has a component for one and a module for the other, and between them they handle most of what you'd otherwise tune by hand. It's the pair a lot of production Next sites rely on.

## next/image

```jsx
import Image from 'next/image';

<Image src="/images/hero.jpg" alt="Loaves on a rack" width={1600} height={900} sizes="100vw" preload />
```

What you get for free:

- A resized, modern-format copy served at the right size for each screen (through `/_next/image`).
- `width` and `height` reserve the space, so nothing jumps when the image arrives (no layout shift).
- **Lazy loading by default**: images load only when they're about to scroll into view.
- `alt` is required in practice. Describe the picture, or use `alt=""` for pure decoration.

The one image that should *not* be lazy is the biggest one on screen at load, usually the hero. Next 16 gives you `preload` for that. It adds a `<link rel="preload">` and tells the browser this image matters. The old `priority` prop still works but is deprecated. Only preload one or two images, because preloading everything is the same as preloading nothing.

`sizes` tells the browser how wide the image will be at each screen width, so a phone doesn't download the desktop version.

## next/font/local

```jsx
import localFont from 'next/font/local';

const instrument = localFont({
  src: './fonts/instrument-serif-latin-400-normal.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-instrument',
});

<html className={instrument.variable}>
```

The font file lives **in your repo**. Next copies it into your build, preloads it and generates the `@font-face`. No request ever goes to Google: not when you build, not when a visitor loads the page. (`next/font/google` exists, but it downloads at build time, so a failed download breaks the build. Commit the file instead.)

The `variable` option makes a CSS variable. In `globals.css`, an `@theme inline` block connects it to Tailwind, so `font-display` just works:

```css
@theme inline {
  --font-display: var(--font-instrument);
}
```

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The page uses plain `<img>` tags and system fonts.
2. Open `tests/media.test.jsx`.
3. In `components/Hero.jsx`, swap the `<img>` for `<Image>` with `width={1600}`, `height={900}`, `sizes` and `preload`.
4. In `components/Gallery.jsx`, do the same with 800 by 600, and no `preload`.
5. In `app/layout.jsx`, load both fonts from `app/fonts` with `localFont`, then add both `variable` classes to `<html>`.
6. In `app/globals.css`, add the `@theme inline` block.
7. Press **Check my work**. It builds the site and reads the HTML for preloads, lazy images and font links.

> Tip: for a woff2 you don't have, download it once, commit it, and never think about the source again. That's what "committed fonts" means.
