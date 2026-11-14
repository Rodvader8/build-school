Motion is what makes a site feel expensive. GSAP does the big scroll effects later, but plenty of polish is plain CSS: a button that lifts on hover, a heading that rises into place.

## Transitions: smooth changes between two states

```css
.nm-button {
  transition: transform 200ms ease, background-color 200ms ease;
}

.nm-button:hover {
  transform: translateY(-2px);              /* lift 2px */
  background-color: var(--nm-gold-hi);
}
```

The transition sits on the **normal** state, so the button eases both into the hover and back out of it. `transform` and `opacity` are the cheapest things to animate. The browser hands them to the graphics card, so they stay smooth on phones.

## Keyframes: an animation that plays by itself

```css
@keyframes nm-rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}

.nm-hero-copy {
  animation: nm-rise 800ms ease-out both;
}
```

`both` holds the first frame before the animation starts and the last one after it ends, so nothing flashes.

## Respect reduced motion

Some people get dizzy or sick from movement on screen, and set "reduce motion" in their phone or computer settings. Every well-built site honours it. This block goes in every project you build:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Your turn

1. Style `.nm-button` as a gold pill: `display: inline-block`, `border: 0`, `border-radius: 999px`, `padding: 14px 24px`, `background-color: var(--nm-gold)`, `color: var(--nm-ink)`, `font: inherit`, `font-weight: 600`, `text-decoration: none`, `cursor: pointer`.
2. Add the transition, and the `:hover` lift.
3. Give `.nm-button:focus-visible` an outline: `2px solid var(--nm-paper)`, offset `3px`.
4. Add the `nm-rise` keyframes and play them on `.nm-hero-copy`.
5. Add the reduced-motion block.

Press the reload button above the preview to replay the entrance.
