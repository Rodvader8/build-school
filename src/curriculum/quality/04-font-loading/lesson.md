Fonts are the quiet performance problem. The page can be ready, the image can be ready, and the headline still doesn't show because the browser is waiting for a font file from somebody else's server. Three habits fix almost all of it.

## 1. Never @import a font stylesheet

The classic way to use Google Fonts is one line at the top of your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Geist&display=swap');
```

It looks harmless and it's slow. The browser can't see that line until your stylesheet has downloaded. Then it opens a connection to a different company's server, downloads *their* stylesheet, and only then learns where the actual font file is and starts downloading that. A chain of three waits, one after another, and rendering is held up by the first two.

A `<link>` to the same URL is a bit better, but still depends on another server. The robust answer is to **host the font files yourself**.

## 2. Self-host woff2

Download the `.woff2` files, keep them in your project (in a `fonts` folder here), and describe them with `@font-face`:

```css
@font-face {
  font-family: 'Geist';
  src: url('fonts/geist-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

Same origin, no extra connection, cached with the rest of your site. `woff2` is the compressed format every current browser reads. A *variable* font such as this Geist holds every weight in one file, which is why `font-weight` shows a range.

## 3. Choose what shows while the font loads

`font-display` decides what visitors see before the file arrives:

| Value | While loading |
|---|---|
| `block` | Invisible text (up to 3 seconds). Bad. |
| `swap` | A fallback font straight away, swapped when the real one lands. |
| `optional` | Fallback, and the real font only if it arrives very quickly. |

Use `swap` as your default: people can read immediately. That only works if you give the browser a good fallback after your font in `font-family`, such as `'Geist', system-ui, sans-serif`.

## Preload the one that matters

The browser discovers a font late: first the HTML, then the CSS, then it sees something uses it. A **preload** in the head says "you'll need this, start now":

```html
<link rel="preload" href="fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
```

Two details trip everyone up. The `crossorigin` attribute is required for fonts, even from your own site, or the browser downloads the file twice. And preload **one** font, the one used by the biggest text on screen (here, the headline). Preload everything and you've just recreated the problem: lots of early requests competing with the things that matter.

## Your turn

The page uses Instrument Serif for headings and Geist for text, but the starter loads them the slow way.

1. In `style.css`, delete the `@import` line.
2. Write an `@font-face` for each family, pointing at the `.woff2` in `fonts/`, with `font-display: swap`.
3. Make sure each `font-family` ends with a fallback (`serif` for the headline, `system-ui, sans-serif` for the body).
4. In `index.html`, preload the headline font and no other.
5. Press **Check my work**.
