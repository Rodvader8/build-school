Time for the signature look: a full-height hero where the photo fills the screen and the words sit over a dark fade. Larkfield, Brightwater and Stonebridge all open this way.

## Layering with position

```css
.nm-hero {
  position: relative;      /* children position themselves against this box */
  display: grid;
  align-items: end;        /* push the copy to the bottom */
  min-height: 80vh;        /* 80% of the screen's height */
  overflow: hidden;
}

.nm-hero-img {
  position: absolute;
  inset: 0;                /* top, right, bottom and left all 0: fill the hero */
  width: 100%;
  height: 100%;
  object-fit: cover;       /* crop to fill, never stretch */
}
```

`position: absolute` lifts an element out of the normal flow and places it against the nearest parent that has `position: relative`. That's how you stack an image, a shade and text on top of each other.

## A shade without an extra element

`::after` creates a pretend element inside the hero, styled entirely from CSS:

```css
.nm-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to top, var(--nm-ink) 10%, transparent 70%);
}
```

The gradient fades from the page colour at the bottom to clear, so the words stay readable on any photo.

Then lift the words above the shade:

```css
.nm-hero-copy { position: relative; z-index: 1; padding: 48px 24px; }
```

`z-index` sets the stacking order. Higher numbers sit on top.

## Your turn

1. Build the hero, the image, the `::after` shade and the copy layer using the rules above.
2. Style the small line above the heading, `.nm-eyebrow`: gold, `font-size: 0.8rem`, `letter-spacing: 0.2em` and `text-transform: uppercase`. Wide-spaced capitals are a classic premium detail.
