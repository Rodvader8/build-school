Most "this looks off" feedback on a website isn't about colour or fonts. It's that things don't line up: a card that's 3px wider than its neighbour, a column that runs to the screen edge, a nav that wraps for no reason. A layout system fixes that once, for every page.

This track is less hand-holding than the ones before it. Each lesson states a standard and checks your page against it with measurements. How you get there is up to you.

## The standard

**One column.** Every section's content lives inside a single centred container with a maximum width. The page can be any width; the column isn't. That gives every section the same left and right edge, which is most of what "tidy" means.

```css
.wrap {
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: 24px;
}
```

**Flex for a line, grid for a surface.** A nav is one line of items, so it's flexbox. A card area is rows and columns together, so it's grid. Reaching for the wrong one is how you end up with `margin-left: 13px` hacks.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

**One gap, set on the parent.** Never space cards with margins on the cards. A single `gap` keeps the row and column spacing identical, and a card can move without dragging its spacing with it.

**Spans, not sizes.** A featured card doesn't get a custom width. It spans two tracks (`grid-column: span 2`), so it always lines up with the cards below it.

**Collapse on purpose.** At a narrow width, the grid becomes one column, and anything that spans two tracks must stop spanning. That's the one media query this page needs.

Any well-built site is a good place to see this. Resize the window and watch where the content's left edge sits, and when the card rows reflow.

## Your turn

1. Open `style.css`. The page has colour and type already; the layout is missing. Open the preview to see it stacked and edge to edge.
2. Add a `.wrap` rule so every section's content is a centred column. The checks want it between 900px and 1140px wide at the preview's 1200px.
3. Make the header's `.wrap` a flex row, with the brand on the left and the nav on the right.
4. Make `.cards` a three-column grid with one gap of at least 16px. Remove the `margin-bottom` on `.card`, since the gap replaces it.
5. Make the first card span two columns. Check that its right edge lines up with the cards below it.
6. Add a `max-width` media query that turns `.cards` into one column and resets the span.
7. Press **Check my work**.

> Tip: DevTools has a grid overlay. In the Elements panel, click the small `grid` badge beside `.cards` to see the tracks and gaps drawn on the page.
