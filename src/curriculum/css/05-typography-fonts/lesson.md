Type does more for a premium feel than any other single thing. Larkfield pairs **Instrument Serif** for headings with **Geist** for everything else, and both are served from the site itself.

## Self-hosted fonts

Look in the Explorer: there's a `fonts` folder with two `.woff2` files. WOFF2 is the compressed web font format. You tell the browser about each one with `@font-face`:

```css
@font-face {
  font-family: 'Instrument Serif';
  src: url('fonts/instrument-serif-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

| Line | Why |
|---|---|
| `font-family` | The name you'll use in the rest of your CSS. |
| `src` | Where the file is, relative to this stylesheet. |
| `font-weight` | The weights this file covers. Geist is a **variable font**, so one file covers every weight: `font-weight: 100 900`. |
| `font-display: swap` | Show text straight away in a fallback font, then swap when the real one arrives. Visitors never stare at invisible text. |

**Why not just link Google Fonts?** Every request to someone else's server costs time before your text appears, and sends your visitors' details to that company. A good rule for every site: the font files are committed to the project and served from the site itself.

## Setting the type

```css
body { font-family: 'Geist', system-ui, sans-serif; line-height: 1.6; }

h1, h2, h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  line-height: 1.1;
}

.nm-hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); }
```

The list after the font name is the **fallback stack**, used until the font loads or if it fails. `clamp(min, preferred, max)` makes the heading scale with the window (`6vw` is 6% of its width) but never smaller than `2.5rem` or bigger than `4.5rem`. That's fluid type, with no breakpoints needed.

## Your turn

1. Write the two `@font-face` rules at the top: Instrument Serif (weight 400) and Geist (weight `100 900`), both with `font-display: swap`.
2. Set `body` to Geist with `line-height: 1.6`.
3. Set `h1, h2, h3` to Instrument Serif, weight 400, line height 1.1.
4. Give `.nm-hero-title` the `clamp()` size above.
5. Limit `.nm-lede` to a comfortable line length: `max-width: 60ch` (about 60 characters).
