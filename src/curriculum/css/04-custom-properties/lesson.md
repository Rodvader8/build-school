Your stylesheet now uses the same five colours over and over. If Larkfield's brand gold changed tomorrow, you'd hunt through the whole file. **Custom properties** (CSS variables) fix that.

## Design tokens

Define each value once, at the top, on `:root` (the `html` element):

```css
:root {
  --nm-ink: #0c1220;
  --nm-paper: #e8e4da;
  --nm-gold: #f2c38b;
}
```

Then use it anywhere with `var()`:

```css
h1 {
  color: var(--nm-gold);
}
```

Names must start with two dashes. The `nm-` prefix keeps them from clashing with other sites' tokens.

These named values are called **design tokens**. Each brand has its own set, and that's most of what makes twelve sites look like twelve different brands while sharing one way of building.

## Your turn

1. At the top of the stylesheet, add a `:root` block with these seven tokens:

| Token | Value |
|---|---|
| `--nm-ink` | `#0c1220` |
| `--nm-paper` | `#e8e4da` |
| `--nm-muted` | `#b8b2a4` |
| `--nm-gold` | `#f2c38b` |
| `--nm-gold-hi` | `#f6d3a8` |
| `--nm-panel` | `#141b2d` |
| `--nm-line` | `rgba(232, 228, 218, 0.14)` |

2. Replace **every** colour in the rest of the file with the matching `var(--nm-...)`.
3. The page should look exactly the same. That's the point.
4. Now try it: change `--nm-gold` to another colour and watch the heading, the hover and the focus outline change together. Put it back before you check.
