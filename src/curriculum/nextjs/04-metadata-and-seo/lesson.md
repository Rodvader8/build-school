Search engines, link previews in Slack and the cards you see when a link lands on LinkedIn all read the same few tags in your page's `<head>`. Get them right and every page can introduce itself properly. Next.js generates them for you from plain JavaScript objects, so you never hand-write the tags. Most production Next sites do it this way on every page.

## A metadata object

Export `metadata` from a `layout` or `page` (server components only):

```js
export const metadata = {
  title: 'Menu',
  description: 'Sourdough, rye and pastries, baked fresh each morning.',
};
```

Metadata **merges down the tree**. Put the defaults in the root layout and override per page. A **title template** adds the site name for you:

```js
title: { default: 'Fennel & Co Bakehouse', template: '%s | Fennel & Co' },
```

A page with `title: 'Menu'` now reads "Menu | Fennel & Co". Set `metadataBase` once and relative URLs (the share image, the canonical link) become absolute automatically.

## generateMetadata

When the title depends on data, export an async function instead. It gets the same `params` Promise as the page:

```js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = menu.find((m) => m.slug === slug);
  return { title: item.name, description: item.blurb };
}
```

## Share images

`openGraph.images` sets `og:image`. Use a **JPG or PNG**, 1200 by 630. WebP looks fine in a browser but LinkedIn, Facebook and Slack often ignore it.

## Sitemap and robots

Two special files in `app/` become real URLs:

| File | Served at |
|---|---|
| `app/sitemap.js` | `/sitemap.xml` |
| `app/robots.js` | `/robots.txt` |

Each exports one function that returns plain data. Sitemap URLs must be absolute.

## Structured data

A `<script type="application/ld+json">` tells search engines what kind of business this is. It's the same JSON-LD you met in the quality track, written as a small object and passed through `JSON.stringify`.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Right-click the preview and view the page source to see how bare the head is.
2. Open `tests/seo.test.jsx`.
3. In `app/layout.jsx`, add `metadataBase`, a title template, `alternates.canonical: './'` and an `openGraph` with `images` pointing at `/og.jpg`.
4. Give `app/about/page.jsx` and `app/menu/page.jsx` a `metadata` object each.
5. Add `generateMetadata` to `app/menu/[slug]/page.jsx`.
6. Create `app/sitemap.js` and `app/robots.js`.
7. Add Bakery JSON-LD to the home page.
8. Press **Check my work**. It builds the site, then reads the real `<head>` of each page.

> Tip: in dev, view-source shows the tags. In a production build they're baked into the HTML files in `.next/server/app`, which is exactly what a crawler reads.
