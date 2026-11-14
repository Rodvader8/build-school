Look at a page with 22px here, 25px there and 38px somewhere else. Nobody chose those numbers, and you can feel it without being able to say why. Everything is slightly out of step with everything else.

Spacing is the quietest part of a design and the one people judge most by instinct. The fix is dull on purpose: a short list of allowed values, used everywhere.

## The standard

**A base unit and a scale.** Pick one unit (8px is the usual) and allow only a few multiples of it. A half step (4px) is handy for tight spots like an icon and its label.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 96px;
}
```

After that, no padding, margin or gap in the file is a raw number. That's the rule the checks enforce, and it's also what makes a redesign a ten-minute job: change a token, and every gap moves together.

**Proximity.** Space tells people what belongs together. Three levels is enough:

- *Inside a component* is the smallest: a card's heading and its text.
- *Between components* is bigger: the gap between cards.
- *Between sections* is bigger again.

When those three are clearly different, structure is obvious with no lines or boxes. When they're all roughly the same, everything looks like one pile.

**Rhythm.** Repeated things get repeated spacing. Every section uses the same vertical padding, so scrolling down feels like a steady beat instead of a series of surprises. Every card pads equally on all four sides.

**One gap, set on the parent.** From the layout lesson: `gap` on a flex or grid container, not margins on its children. It means a component carries no opinion about what's next to it.

**Browser defaults count.** Headings and paragraphs come with their own margins (a `0.83em` margin at 24px is 19.92px). Reset them to a token, or they'll stay in the layout as off-grid values.

## Your turn

1. Open the preview and read the stylesheet. Count how many different spacing values it uses. It's a lot more than seven.
2. Add `--space-1` to `--space-7` to `:root`, in the pattern above.
3. Replace every `padding`, `margin` and `gap` value with a token. Use `0` where there's nothing.
4. Make the two sections use identical vertical padding of 48px or more.
5. Get the three proximity levels in order: card interior, then the cards' gap, then the section padding.
6. Press **Check my work**.

> Tip: DevTools shows margin and padding as coloured boxes on the Computed tab. Hover a card to see them drawn on the page.
