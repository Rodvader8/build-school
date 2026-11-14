The first thing you do on any real project is set up its design tokens: the colours, fonts and spacing that make the site look like itself. In Tailwind 4 that happens in your CSS file, not in a JavaScript config.

## Setup is two lines

```css
@import "tailwindcss";
```

That's the whole stylesheet to begin with. The Vite plugin (`@tailwindcss/vite`, already listed in `package.json` and loaded in `vite.config.js`) does the scanning and the building. There's no `tailwind.config.js` in version 4, so ignore any tutorial that starts with one.

## @theme turns variables into utilities

```css
@theme {
  --color-ink: #0b0a14;
  --font-display: "Instrument Serif", serif;
}
```

Variables inside `@theme` aren't just CSS variables. Tailwind reads the **name** and builds utilities from it:

| Variable | Gives you |
|---|---|
| `--color-ink` | `bg-ink`, `text-ink`, `border-ink`, `ring-ink`... |
| `--font-display` | `font-display` |
| `--spacing-gutter` | `p-gutter`, `mt-gutter`, `gap-gutter`... |

The part before the first dash is the **namespace** (`color`, `font`, `spacing`, `breakpoint`) and it decides which utilities appear. Defining `--font-sans` replaces the default sans stack, so plain body text switches to it with no extra class.

Tailwind also emits each theme variable as a real CSS variable, but only for the ones your page uses. That's why the built CSS stays small.

## A dark premium palette

Name colours by role, not by hue. `bg-surface` still makes sense after you change the colour. `bg-purple-950` doesn't.

## Self-hosted fonts

The font files live in `src/fonts`. Declare them with `@font-face` **above** `@theme`, then refer to the family name in the font token:

```css
@font-face {
  font-family: "Geist";
  src: url("./fonts/geist-latin-wght-normal.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

Vite finds the file from that URL and copies it into the build, with a hashed name. No request ever goes to Google, which is faster and avoids sharing your visitors' data with a third party.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The page is on a white background, because none of its classes exist yet.
2. Open `src/style.css`. Add an `@font-face` for each font in `src/fonts`.
3. Fill in `@theme` with six colours: `--color-ink` (near black), `--color-surface`, `--color-line`, `--color-cream` (near white), `--color-muted` and `--color-accent` (cyan).
4. Add `--font-sans` ("Geist") and `--font-display` ("Instrument Serif"), each with a fallback.
5. Press **Check my work**.

> Tip: write colours as hex here so the check can read them. Tailwind accepts `oklch()` too, and it's what the default palette uses internally.
