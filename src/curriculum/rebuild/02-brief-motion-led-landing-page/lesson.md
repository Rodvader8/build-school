This is the first of three briefs, and there's no step-by-step. A client has sent you the words, the photos and the fonts, and you've got a standard to meet. That's what most real work looks like.

The business is **Halden Audio**, an invented workshop that builds loudspeakers by hand. The page has to feel considered and move well, in the way the best motion-led sites do. A hero with a headline that arrives word by word. Sections that ease in. Photographs that drift a little slower than the page. Then it has to pass the same quality gate you met in the last lesson, without a single exception.

## What you've got

- `BRIEF.md`: the business, the audience, the sections, the tone and the must-haves. Read it twice before you write a line.
- `src/data/halden.js`: every word the page says, plus the alt text for each image.
- `src/assets`: the two fonts and four images.
- `gate.mjs` and `check.mjs`: the gate, plus a few rules about this brief in particular.

You'll notice what you haven't got: a layout, a stylesheet, or any markup. You decide the structure, the type scale, the spacing and the motion.

## Things worth deciding before you type

Where does each image go, and which one is the hero? What does the headline look like at 375 pixels wide? What should be visible if the script never loads? That last one matters more than it sounds. Start from a page that works with no JavaScript, then add motion on top, only when the visitor hasn't asked for less of it.

The gate will tell you what's wrong, but it can't tell you whether the page is any good. Look at it at a few sizes. Does the type have a clear order? Is there one idea per section? Would you put your name on it?

## Your turn

1. Run `npm install` in the terminal.
2. Read `BRIEF.md`, then open `src/data/halden.js`.
3. Build the page. Start with the layout and head, then the sections, then the motion.
4. Run `npm run gate` after each layer. Read the failures from the top.
5. When every line is a PASS, start the dev server, look at it for five minutes, and fix whatever you'd be embarrassed by.

> Tip: if a rule fails and you don't see why, open `gate.mjs` and find its name. Each rule is a few lines of plain Node, and it tells you exactly what it looks at.
