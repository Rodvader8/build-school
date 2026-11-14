Every element on a page is a box. Getting comfortable with boxes is most of what "good spacing" means.

## The box model

From the inside out:

| Layer | What it is |
|---|---|
| **content** | The text or image itself. |
| **padding** | Space inside the box, between the content and the border. Takes the box's background colour. |
| **border** | The line around the padding. |
| **margin** | Space outside the box, pushing other boxes away. |

```css
.nm-card {
  padding: 24px;
  border: 1px solid rgba(232, 228, 218, 0.14);
  border-radius: 16px;           /* rounded corners */
  background-color: #141b2d;
}
```

`rgba()` is a colour with transparency. The last number runs from `0` (invisible) to `1` (solid), so `0.14` gives a faint line that works on any dark background.

## One line every project starts with

By default, `width` doesn't include padding and border, which makes sizes hard to reason about. Pros switch every element to the saner model on line one:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Browsers also add an 8px `margin` to `body`. That's why the page has a thin gap around the edge.

## Your turn

1. Add the `box-sizing: border-box` rule above.
2. Give `body` `margin: 0`.
3. Make images behave: `img { max-width: 100%; height: auto; display: block; }`. The headland stops spilling off the side.
4. Give `.nm-section` `padding: 96px 24px` (96px top and bottom, 24px left and right).
5. Remove the bullets and indent from `.nm-services`: `list-style: none; margin: 0; padding: 0;`
6. Turn each `.nm-card` into a panel, using the rule above.

> In Chrome, right-click any element in the preview, choose **Inspect**, and you'll see its box drawn in colour: blue content, green padding, yellow border and orange margin.
