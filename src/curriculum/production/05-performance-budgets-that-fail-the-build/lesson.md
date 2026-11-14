Sites don't get slow in one go. They get slow one innocent change at a time: a chart library here, a hero photo there, a tracking script somebody asked for. Nobody notices a 20 KB addition. Twelve months later the page weighs two megabytes and nobody can say when it happened.

A **performance budget** is how you stop that. You decide, in advance, how heavy each part of the page is allowed to be, write it down, and make the build fail when a change breaks it. The decision then happens in the pull request, while the change is still cheap to undo, instead of in a client's email.

## What to budget

Budget what you control and what doesn't change with the machine:

- **Initial JavaScript, gzipped.** Code the page needs straight away. This is the one that bites on slow phones.
- **CSS, gzipped.**
- **The largest image.** One uncompressed photo can outweigh all your code.
- **Everything on first load.** The sum, as a safety net.

Notice what isn't in the list: Lighthouse's performance score, or any timing. Those wobble from machine to machine, and a build that fails at random teaches people to ignore it. Bytes don't wobble. A 2 MB image is 2 MB on every laptop.

## Lazy code isn't free, but it isn't initial

The usual way to stay inside a budget isn't to delete things. It's to load them later. A big charting library most visitors never open can sit in its own chunk and arrive on click, using `import('./charts.js')`. The bundler splits it off automatically. It still counts as shipped code, but not as code that delays the first paint.

## Structural Lighthouse assertions

Some Lighthouse audits are true or false everywhere: do all images have a width and height (`unsized-images`)? Is anything blocking the first paint (`render-blocking-insight`)? Are images big enough for their slot (`image-size-responsive`)? You'll assert those, plus a ceiling on `total-byte-weight`, and nothing that depends on timing.

## Your turn

1. Run `npm install`, then `npm run build`. It builds but nothing checks the weight. This app has a heavy chart eagerly loaded, and an `<img>` with no dimensions.
2. Write `measure()` and `evaluate()` in `scripts/budgets.mjs`, then the command-line part at the bottom. The comments spell out each return value.
3. Set sensible numbers in `budgets.json`. The checker wants all four, under the ceilings in the check message.
4. Change the build script in `package.json` to `vite build && node scripts/budgets.mjs`. If the second half fails, the build fails.
5. Run the build. It should fail. Fix it the right way: lazy-load the chart in `src/main.js` rather than raising the budget.
6. Fill in `lighthouse-assertions.json` (the three audits and a byte ceiling), fix the image, and run `npm run lighthouse`.

> Tip: raising a budget to make a build pass is allowed, but it should be a decision someone writes down in a pull request, never a quiet edit.
