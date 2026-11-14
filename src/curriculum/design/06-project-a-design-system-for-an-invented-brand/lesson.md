This is the first project of the unguided stage. There's no step-by-step. You get a brief, a standard and a page that measures you against it.

A **design system** is the smallest set of decisions that lets one person build a hundred pages that look like one brand. It isn't a mood board. It's tokens, plus a specimen page that shows each token doing its job. That page is what you hand to the next developer.

## The brief

Invent a brand. A bakery, a bike shop, a software tool: anything. Write one sentence for it at the top of the page, then fill in `tokens.css`. The specimen page (`index.html` and `style.css`) is built entirely from your tokens, so the moment they're defined, the page comes to life.

Your system has to meet every standard from the last five lessons:

- **Colour.** Six roles: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-brand`, `--color-signal`. Every pair passes WCAG AA. Ten distinct colours at most and no more than three hues beyond the neutrals. (Kestrel Cycles gets by on two: green and amber.)
- **Type.** Two font stacks, and six sizes `--step-0` to `--step-5` from a base of 16 to 18px and a constant ratio. The samples on the page prove it, and so does every heading.
- **Spacing.** Six steps, `--space-1` to `--space-6`, on a 4px or 8px grid. Nothing on the page may fall off it.
- **Shape.** One `--radius`, used by cards and inputs alike.
- **Components.** One primary button, one quiet secondary, a card and an input, each with a visible keyboard focus style.

## How it's measured

Look at the checks in the panel. Each one tells you the number it wants. None of them cares *which* colours or fonts you pick, so choose a brand you'd enjoy looking at. The rules only ensure it holds together.

Some traps worth knowing:

- Contrast has to work for text on the card surface as well as on the canvas. The muted colour is the usual casualty.
- The primary button's text uses `--color-bg`, so your brand colour has to contrast with the canvas, not only with white.
- Custom properties set in `tokens.css` are read by the page through `var()`. A typo in a token name quietly turns the property off.

## Your turn

1. Read `style.css` so you know which tokens the page expects. Leave its structure alone.
2. Invent the brand. Write the sentence into `index.html`, and swap the name.
3. Fill in `tokens.css`. Define all the tokens listed in the brief.
4. Add `:focus-visible` styles for `.btn` and `.input` to `style.css`.
5. Press **Check my work**, then work down the failures. Fix one at a time.
6. When it's green, view the page with your system theme switched, and shrink the window. Is there anything the checks can't see that you'd change? Note it for the capstone.

> Tip: change `--color-brand` and watch the swatch, the bars and the button change together. That's the payoff for the whole track.
