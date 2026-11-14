The hero, header and cards are done. Four parts of the page are still unstyled: the steps, the fee table, the enquiry form and the footer. This time there's no step-by-step. You decide how they look, using only what you've learned, and the checks hold you to the standard a professional site is built to.

## The brief

- **Steps** (`.nm-steps`): a grid with a gap between the steps, in the muted colour.
- **Fee table** (`.nm-fees`): full width, `border-collapse: collapse`, left-aligned header and data cells, comfortable cell padding (at least 8px), and a faint line under each row using `var(--nm-line)`.
- **Form** (`.nm-form`): a grid with gaps, a sensible `max-width`, and inputs that belong on a dark page: the panel background, the line border, paper-coloured text, padding and rounded corners. `font: inherit` stops inputs using the browser's tiny default font.
- **Focus**: inputs need a clear `:focus-visible` outline.
- **Footer** (`.nm-footer`): padding, a top border and muted text.

## The house rules

These are good habits to build every site with:

1. **Every colour comes from a token.** No hex or rgb values outside `:root`.
2. **No inline styles.** Never `style="..."` in the HTML. Classes only.
3. **Keyboard users can always see where they are.**

> When everything passes, you've written the kind of stylesheet a finished Larkfield site would have. What's left is the GSAP motion you'll learn in Stage 4.
