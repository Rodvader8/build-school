More than half of visits to a local business site come from a phone. Good sites are designed "for a thumb first and a desktop second", which in CSS is called **mobile-first**.

## Media queries

A media query wraps rules that only apply when a condition is true:

```css
.nm-header {
  display: flex;
  flex-direction: column;   /* phones: logo above the menu */
  gap: 12px;
}

@media (min-width: 48rem) {
  .nm-header {
    flex-direction: row;    /* 768px and up: side by side */
    justify-content: space-between;
    align-items: center;
  }
}
```

**Mobile-first** means the plain rules are for the smallest screen, and `min-width` queries add to them as the screen grows. The opposite, desktop-first with `max-width`, makes phones download and undo the desktop layout. Mobile-first is simpler and faster.

`48rem` is 768px at the default font size. Using `rem` in media queries respects people who've made their browser's text bigger.

## Your turn

1. Find the `.nm-header` rule from lesson 6. Change it so phones get `flex-direction: column` and `gap: 12px`. Remove `justify-content` and `align-items` from it.
2. At the bottom, add `@media (min-width: 48rem)` and put the row layout (`flex-direction: row`, `justify-content: space-between`, `align-items: center`) inside it.
3. In the same media query, give `.nm-section` more room on big screens: `padding: 120px 48px`.
4. Don't use any `max-width` media queries.

Test it: open the preview in its own tab and narrow the window until the menu drops under the logo.

> The `viewport` meta tag from HTML lesson 3 is what makes this work on real phones. Without it, phones pretend to be a 980px desktop and your media queries never fire.
