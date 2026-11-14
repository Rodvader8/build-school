Good art direction isn't more decoration. It's picking one idea for a page and making everything else defer to it. Visitors decide in a couple of seconds whether a page is for them, and a page with five loud things gives them nothing to hold on to.

You can check that without taste. Count the things shouting.

## The standard

**One dominant element.** The headline is the largest thing in the view by a clear margin. The checks use 1.5 times the next size and 2.5 times the body. Stats, badges and buttons come second. If the stat numbers are as big as the headline, the page has two ideas, and the reader has to choose.

**One primary action.** A view has one filled button. The second and third actions are outlines, so the filled one wins every time without needing a bigger size or a pulsing animation. And it's above the fold on a laptop, not under a scroll.

**A short, committed headline.** Under ten words. A short lede under thirty. If it takes more words, it's two ideas.

**Two hues.** A brand colour and a signal colour, with neutrals for everything else. Kestrel Cycles, the invented brand from the colour lesson, uses a green brand colour with amber as the signal, and nothing else carries colour. Restraint is what makes the one coloured thing stand out.

**Emphasis as a technique.** One phrase in the headline gets a different treatment from the rest. A hollow outline (transparent fill, thin stroke) is one option. It's quiet and distinctive, and it can only be used once per heading or it stops meaning anything.

```css
.emph {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--signal);
}
```

**Restrained motion.** Transitions under 300ms, nothing that loops, and a `prefers-reduced-motion` query so people who ask for no motion get none.

## Your turn

1. Open the preview. The hero has three equally coloured buttons, a pulsing animation, four hues, and a stat number almost as big as the headline.
2. Make the primary button the only filled one. Style the others as outlines.
3. Make the h1 dominant: raise it, and bring the stat numbers down to a supporting role.
4. Restyle the `.emph` word as a hollow outline.
5. Reduce the colours to two hues beyond the neutrals, and remove the infinite animation.
6. Shorten the transition to 300ms or less and add a `prefers-reduced-motion` query.
7. Press **Check my work**.

> Tip: squint at the preview, or shrink your browser to half size. The first thing you can still read is the thing your page is actually about.
