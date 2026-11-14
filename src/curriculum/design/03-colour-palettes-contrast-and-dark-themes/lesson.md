Colour is where "I'll know it when I see it" does the most damage. Most sites end up with twenty-odd colours, a few of which can't actually be read by anyone over forty, or by anyone outdoors. Neither problem shows up on your own monitor.

The fix isn't taste. It's a short palette, named once, and a contrast ratio you can measure.

## The standard

**A palette is a handful of roles, not a handful of colours.** Name what each is for:

| Token | Role |
|---|---|
| `--bg` | The canvas |
| `--surface` | Cards and panels, one step off the canvas |
| `--text`, `--muted` | Primary and secondary text |
| `--brand` | The one colour people remember |
| `--signal` | The "live" colour: links, eyebrows, status |

One trap catches nearly everyone. A colour that reads well as **text on a dark background** can fail as a **fill behind white text**. A bright violet on near-black passes, but put white words on that same violet and the ratio can drop below 4.5:1. Check every pair the colour actually appears in, in both themes, and darken the fill (or give it its own token) when it fails.

Take an invented bike-shop brand, Kestrel Cycles: a near-black canvas with a green tint, green as the brand and amber as the signal. Two hues. Everything else is a neutral. A tinted neutral sits more comfortably next to the brand than a flat grey does.

**Contrast is a number.** WCAG AA asks for **4.5:1** between body text and what's behind it, or **3:1** for large text (24px and up, or 18.66px bold). Muted text is where sites fail: grey on a dark surface looks "subtle" and measures 3:1.

**Avoid the extremes on a dark theme.** Pure `#000` with pure `#fff` is harsher than it looks, and text seems to vibrate. A very dark tinted canvas with off-white text is easier to read at the same contrast.

**Tokens make theming cheap.** If every colour is `var(--...)`, a light theme is the same tokens with new values:

```css
@media (prefers-color-scheme: light) {
  :root { --bg: #f7f6fb; --text: #1b1830; }
}
```

The checks work on computed colours, so write colours as hex, `rgb()` or `hsl()`.

## Your turn

1. Open the preview. The starter has a black canvas, six hues, and muted text you can barely see.
2. Define the six tokens on `:root`, then replace every colour in the rest of the file with a `var()`.
3. Choose values so every pair passes 4.5:1, or 3:1 for large text, and the palette has no more than two hues besides neutrals. Use DevTools or a contrast checker as you go.
4. Add the light-theme media query, redefining the tokens. The preview follows your system's theme and the checks measure whichever one renders, so make sure both palettes pass on their own.
5. Press **Check my work**.

> Tip: the check counts distinct *painted* colours. Reusing one token everywhere is the quickest way to get under eight.
