Images are usually the heaviest thing on a page and the biggest part of LCP. A client uploads a 6 MB photo straight off a phone, it goes on the site as it is, and every visitor downloads all of it, on a phone, on mobile data. An **image pipeline** is a script that takes one big original and produces exactly the right small files, every time, with no manual exporting.

The tool is **sharp**, a fast Node library for resizing and converting images.

```js
import sharp from 'sharp';

await sharp('photos/source.jpg').resize({ width: 960 }).webp({ quality: 75 }).toFile('dist/img/hero-960.webp');
```

You describe a pipeline (resize, then convert) and `toFile` runs it. Heights follow automatically so the picture isn't squashed.

## Formats

| Format | Good for | Notes |
|---|---|---|
| **AVIF** | Photos | Smallest files, supported by all current browsers |
| **WebP** | Photos | Slightly bigger than AVIF, very widely supported |
| **JPG** | Photos | The safe fallback that works everywhere |
| **PNG** | Logos, screenshots | Lossless, big for photos |

One source becomes several files, and the browser picks the best one it understands.

## Responsive sizes: srcset

A phone doesn't need a 1600-pixel-wide image. Give the browser a menu of widths and tell it how wide the image will be shown, and it chooses:

```html
<picture>
  <source type="image/avif" srcset="hero-480.avif 480w, hero-960.avif 960w, hero-1600.avif 1600w" sizes="(min-width: 50rem) 50rem, 100vw" />
  <source type="image/webp" srcset="hero-480.webp 480w, hero-960.webp 960w, hero-1600.webp 1600w" sizes="(min-width: 50rem) 50rem, 100vw" />
  <img src="hero-960.jpg" srcset="hero-480.jpg 480w, hero-960.jpg 960w, hero-1600.jpg 1600w" sizes="(min-width: 50rem) 50rem, 100vw" width="1600" height="1067" alt="..." />
</picture>
```

Each `w` number is the file's real width. `sizes` says how much of the screen the image fills. List AVIF first, then WebP: the browser takes the first source it supports, and the `<img>` is the fallback. Keep `width` and `height` on the `<img>` so the layout doesn't jump (last lesson).

**Never make a file bigger than the original.** Stretching a 2000-pixel photo to 2400 gives a larger file with no extra detail.

## Strip the metadata

Phone photos carry hidden data: the camera, the date and often the GPS location of where it was taken. For a home-based business that could mean your front door. sharp strips all of it by default. It only keeps it if you ask with `.withMetadata()`, so don't.

## The social image is the exception

When a page is shared on Facebook, LinkedIn or in a message, the preview comes from the page's `og:image`. Several of those scrapers still don't read WebP or AVIF, so a shared link shows no picture at all. **Keep `og:image` a JPG or PNG**, sized 1200 by 630.

## Your turn

`photos/source.jpg` is 2000 pixels wide and carries camera data. Open `build-images.mjs`. The starter only makes JPGs and does several things wrong.

1. Make widths 480, 960 and 1600 (not 2400, which is bigger than the source), each as AVIF, WebP and JPG.
2. Stop it keeping metadata.
3. Make `hero-og.jpg` at 1200 by 630, as a JPG.
4. Write `dist/snippet.html`: the `<picture>` above, with real filenames and your photo's height.
5. In `site/index.html`, point `og:image` at the JPG.
6. Run `node build-images.mjs`, then press **Check my work**.
