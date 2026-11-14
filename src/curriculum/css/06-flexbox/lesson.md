Until now everything has stacked top to bottom. **Flexbox** lines things up in a row (or a column) and controls the space between them. Nearly every site header is a flex container.

## Turning a box into a flex container

```css
.nm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

`display: flex` makes the element's **direct children** sit in a row. Then:

| Property | Controls | Common values |
|---|---|---|
| `justify-content` | Space along the row | `flex-start`, `center`, `space-between` |
| `align-items` | Alignment across the row | `stretch`, `center`, `flex-start` |
| `gap` | Space between the children | `24px` |
| `flex-direction` | Row or column | `row`, `column` |

`space-between` pushes the first child to one end and the last to the other. Logo on the left, menu on the right, in one line.

## Your turn

1. Make `.nm-header` a flex container with `justify-content: space-between`, `align-items: center` and `padding: 20px 24px`.
2. Make the menu list, `.nm-nav-list`, a flex row with `gap: 24px`. Remove its bullets, margin and padding.
3. Style the logo, `.nm-logo`: `color: var(--nm-paper)`, `font-weight: 600`, no underline.

> Watch out: `display: flex` goes on the **parent**, and it arranges the parent's **children**. Put it on `.nm-nav-list` (the `ul`), not on each `li`.
