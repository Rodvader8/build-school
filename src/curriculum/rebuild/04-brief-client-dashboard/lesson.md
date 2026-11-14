A dashboard is the opposite of a landing page. Nobody's being persuaded. Somebody's trying to answer a question quickly, usually before their first coffee, and every extra second of confusion costs a bit of trust. The standard is a really good dashboard: honest numbers, clear hierarchy, and an interface that works with a keyboard, a screen reader or a thumb.

This is the last brief, and the one with the most moving parts. You're building the orders dashboard for **Crumb and Co.**, an invented wholesale bakery. It needs four KPI tiles, a chart with a text alternative, a sortable table, a period toggle, and **your own tests**. The gate runs them.

## What you've got

- `BRIEF.md`: the business, the page, the data rules and the two hooks the gate looks for.
- `src/data.js`: every figure, for three periods, plus ten customers.
- `src/assets/fonts`: Geist.
- `vite.config.js`, set up for React and for Vitest with jsdom.
- `gate.mjs` and `check.mjs`.

## What's different this time

The gate adds dashboard rules to the ones you know. It tabs through your page and presses Enter on a column header to prove the table sorts from the keyboard. It looks for a chart with a real name and a table behind it. It clicks a different period and checks that the pressed state moves and the numbers change. And it counts your tests, then runs them.

Think about the order you'd build it in. State first: one piece of state for the period, one for the sort. The figures, the tiles and the rows can all be worked out while rendering. Then pull the table's sorting into a plain function you can test without a browser. Writing the test for that function first is a good habit, and the quickest way to be sure it's right.

Recharts draws the chart as SVG, but SVG alone tells a screen reader nothing. The accessible version of a chart is a sentence and a table.

## Your turn

1. Run `npm install`, then read `BRIEF.md` and open `src/data.js`.
2. Build the page: the layout and styles first, then the tiles, the toggle, the chart and the table.
3. Write your tests as you go, in `tests/`. Run `npm test` often. It takes seconds.
4. Run `npm run gate` when you're ready. It builds, tests, tabs through your page and runs Lighthouse.
5. When every line is a PASS, use the dashboard for a minute with only the keyboard. Then at 375 pixels wide. Fix whatever annoys you.

> Tip: Recharts' `ResponsiveContainer` measures its parent, which is 0 by 0 in a test. Mock it in your chart test so it gets a fixed size, and the chart renders.
