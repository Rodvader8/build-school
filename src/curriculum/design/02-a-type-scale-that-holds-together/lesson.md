Open any page that looks "off" without being obviously wrong, and count its font sizes. It's usually eleven or twelve, each added by a different edit on a different day: 13px here, 17px there, 21px because 20 looked a touch small. Nothing is broken. Nothing is *decided*, either.

A **type scale** is the decision. You pick a base size and a ratio, and every size on the page comes from them.

## The standard

**A modular scale.** Start at 16px for body text and multiply by a ratio. A ratio of 1.25 (a "major third") gives you:

| Step | Size | Typical use |
|---|---|---|
| -1 | 12.8px | Eyebrows, captions |
| 0 | 16px | Body |
| 1 | 20px | Lede paragraph |
| 2 | 25px | h3 |
| 3 | 31.25px | h2 |
| 5 | 48.83px | h1 |

The checks allow 3% tolerance, so `1.25rem` and `20px` both count, and rounding to `31px` is fine.

**Two families at most.** One for headings, one for body. Plenty of good brand systems are exactly that: say a geometric sans for headings and a plain sans for body, with an uppercase label style as a deliberate third voice. The checks here are stricter (two) so you can feel what the constraint does.

**Tight headings, loose body.** Large type needs less line height and negative tracking, or it looks gappy. Small type needs more. A rule of thumb:

```css
h1 { line-height: 1.1; letter-spacing: -0.03em; }
p  { line-height: 1.6; }
```

**Measure.** The width of a text column, in characters, is called the measure. Between 45 and 75 is comfortable. Set it with the `ch` unit on the container, never on the font:

```css
.page { max-width: 68ch; }
```

**Tokens.** Put the steps in custom properties (`--step-0`, `--step-1`) so a change to the scale is one edit. You met tokens in the CSS track; this is the same idea applied to size.

## Your turn

1. Open the preview. The starter has seven different font sizes, three families and a heading that's out of order.
2. Write down your scale, then add `--step--1` to `--step-5` on `:root` (use `rem`).
3. Replace every `font-size` with a `var(--step-n)`. Headings must descend: h1 bigger than h2 bigger than h3 bigger than body.
4. Reduce the page to two font families (a system stack counts as one).
5. Fix the line height and the h1 tracking, and cap the column at a measure of 45 to 75 characters.
6. Press **Check my work**.

> Tip: if a check says a size is off the scale, open DevTools, select the element and read its computed font-size. It's the number the check sees.
