One page is a poster. A service site is a system: four pages that share a header, a footer, a voice and a set of rules, and a form that has to work for someone on a phone in a hurry. This brief is where "I can build a page" becomes "I can build a site".

You're building for **Ironbark Landscape Studio**, an invented landscaping business. It needs four pages (home, services, about and contact), a navigation that always shows where you are, and an enquiry form a stranger can complete in under a minute. The standard is the same quality gate as before, plus a few rules that are about this brief in particular.

## What you've got

- `BRIEF.md`: the business, the audience, every page, the form and the must-haves. Start there.
- `src/data/ironbark.js`: all the words, the alt text for every image, the navigation and each page's title and description.
- `src/assets`: two fonts and five images.
- `gate.mjs` and `check.mjs`.

You decide the file structure. A sensible one has a single layout, a header and a footer component, and four pages. If you find yourself copying the same markup into two pages, that's the signal to make a component.

## Where it usually goes wrong

Forms are the place most service sites fall down. Every field needs a real label (not a placeholder), the right `type` so phones show the right keyboard, and `autocomplete` so the browser can fill it in. Think about what happens when the visitor gets it wrong, too.

Multi-page sites also drift. A title copied from the home page onto three others, a link to a page you've since renamed, a navigation that highlights nothing. The checks look for all three.

## Your turn

1. Run `npm install` in the terminal.
2. Read `BRIEF.md`, then skim `src/data/ironbark.js` so you know the shape of the data.
3. Build the layout and the two shared components first. Then one page at a time, running `npm run gate` when each is done.
4. Make the form last, and test it by tabbing through it with the keyboard.
5. When every line is a PASS, open all four pages at phone width and at desktop width. Read every page out loud. Fix what you'd be embarrassed by.

> Tip: the gate loads every page you build, so it takes longer with four pages than it did with one. Run it when a layer is finished, not after every edit. The dev server is the fast loop.
