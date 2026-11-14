Open almost any client dashboard and you'll find the same two things at the top: a row of big numbers, and a table underneath. Most dashboards start there. Get these right and the charts that follow have something solid to sit on.

## KPI tiles

A **KPI tile** answers "how are we doing?" in one glance: a label, a big number, and how it moved. Three rules make a good one.

1. **Say the direction in words.** "Up 3.3% on last month" works for everyone. A green arrow alone fails colour-blind users and screen readers. The arrow and colour back up the words, they don't replace them.
2. **Good isn't always up.** More revenue is good. More labour cost is bad. The tile takes a `goodWhenUp` flag so the colour follows the meaning, not the sign.
3. **Format once, show everywhere.** `$835,800`, `29.1%` and `$39.24` come from small shared functions, so every tile agrees.

```js
formatMoney(835800)      // "$835,800"
changePct(110, 100)      // 10
```

## Tables

A table is for comparing rows, so the details matter:

- A `<caption>` names the table. Make it `sr-only` if the heading above already does the job visually.
- `<th scope="col">` for column headers, and `<th scope="row">` for the first cell in each row, so a screen reader announces "Harbour Street, Revenue, $412,500".
- Numbers **right-aligned** with `tabular-nums`, so every digit has the same width and a column of figures lines up like an accounts ledger.
- A `<tfoot>` row for totals.

```jsx
<td className="px-4 py-3 text-right tabular-nums">{value}</td>
```

## Where the numbers come from

`src/data.js` holds this month and last month for three venues, and `src/metrics.js` adds them up. `Dashboard.jsx` is already assembled. It just needs your pieces: three formatters, a tile and a table.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. You'll see a heading and nothing else.
2. Open `tests/dashboard.test.jsx`. It's your to-do list.
3. Write the three functions in `src/format.js`.
4. Build `src/components/KpiTile.jsx`. Check each rule above against its tests.
5. Build `src/components/DataTable.jsx`.
6. Press **Check my work** as you go. Fix one failing line at a time.

> Tip: if a formatted number looks wrong, test the function on its own in the terminal with `node -e "import('./src/format.js').then(m => console.log(m.formatMoney(1234.5, 2)))"`. Small pure functions are easy to check that way.
