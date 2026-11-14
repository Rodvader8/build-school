Your first week on a real job isn't writing new code. It's changing code someone else wrote, in a project you've never seen, without breaking it. The skill isn't reading everything. It's finding the right ten lines quickly.

This lesson drops you into a small online shop's codebase with three tickets and no tour guide. The standard is that every ticket is done, the tests pass, and you've left notes that would save the next person an hour.

## A method for strange code

**1. Get the shape before the detail.** List the folders, then read the entry point. In a small project the entry point shows the order things happen in:

```bash
ls -R src
cat src/index.js
```

**2. Search for the words in the ticket.** Users describe what they *see*. Code is full of the same words, usually in a string, a constant or a function name:

```bash
grep -rn "shipping" src
grep -rn "Discount" src
```

`-r` searches folders, `-n` shows line numbers. Add `-i` when you aren't sure about case.

**3. Follow the imports one hop.** A hit tells you where a value is *used*. The `import` line tells you where it's *defined*. Often you want the definition.

**4. Ask where, not how.** For each ticket, answer three questions before changing anything: which file holds the rule, which file shows it to the user, and what else calls it? If you can't answer the third, search for the function's name.

**5. Change the least you can, then run the tests.** The existing tests tell you what you're not allowed to break. Run them before you start, so you know what a clean baseline looks like.

**6. Leave a trail.** A short `NOTES.md` is worth more than a long commit message. Write down where things live, in the words you searched for.

## Your turn

The project is a tiny shop: carts, promo codes, shipping and a receipt. Open `TASKS.md` for the three tickets.

1. In the terminal, run `node --test` to see the tests that exist. They all pass. That's your baseline.
2. Work out the shape: `ls -R src`, then open `src/index.js`.
3. For each ticket, search for its words, find the file, and make the change.
4. Ticket 2 prints data from the order. Log an order in a scratch script to see which fields it carries, and where the promo code lives.
5. Add a test for the gift card rule in `tests/checkout.test.js`.
6. Fill in `NOTES.md` with the file path for each question.
7. Press **Check my work**. `check.mjs` is the acceptance check: read it if a check fails, but don't edit it.

> Tip: if a search returns too much, narrow it. `grep -rn "FREE_SHIPPING" src` finds the definition and every use in one go.
