Flexbox is for one row or column. **CSS Grid** is for rows *and* columns at once, which makes it perfect for card layouts. The Swiss grid on Ellis Ward and the room grid on Brightwater are both CSS Grid.

## A grid that adapts by itself

```css
.nm-services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
```

Read that middle line from the inside out:

- `minmax(240px, 1fr)`: each column is at least 240px wide and at most one equal share (`1fr` means one **fr**action of the free space).
- `repeat(auto-fit, ...)`: fit as many of those columns as the width allows.

So the cards sit four across on a wide screen, two across on a tablet and one on a phone, without a single breakpoint.

You can also be explicit: `grid-template-columns: 1fr 1fr 1fr` gives three equal columns, and `2fr 1fr` gives one column twice as wide as the other.

## Your turn

1. Turn `.nm-services` into a grid using the rule above.
2. Open the preview in its own browser tab (the arrow icon at the right of the address bar) and drag the window narrower and wider. Watch the columns reflow.
3. Try changing `240px` to `400px` and see what happens, then put it back.

> Inspect the grid in Chrome: right-click a card, **Inspect**, and click the small `grid` badge next to the `ul` in the Elements panel. Chrome draws the column lines over the page.
