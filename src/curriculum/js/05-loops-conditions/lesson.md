Loops repeat work for every item in a list. Conditions make decisions. Between them, they turn a list of data into totals, filters and labels: the guts of every dashboard.

## for...of: once for every item

```js
let total = 0;
for (const plan of plans) {
  total += plan.fee;   // the same as total = total + plan.fee
}
```

Read it as "for each plan in plans, do this".

## if, else if, else

```js
if (fee < 5000) {
  return 'entry';
} else if (fee < 10000) {
  return 'mid';
} else {
  return 'top';
}
```

JavaScript checks each condition from the top and runs the first block that's true.

| Comparison | Means |
|---|---|
| `===` / `!==` | is / isn't exactly equal |
| `<` `>` `<=` `>=` | less than, more than, or equal |
| `&&` / `\|\|` | and / or |

## Your turn

The starter has four plans.

1. Add them up with a `for...of` loop into a `let` called `total`. It should be **27500**.
2. Make an array called `premium` holding the **names** of plans with a fee of 7000 or more. Use a loop and an `if`. It should be `['Family', 'Private']`.
3. Write `bandFor(fee)`: under 5000 returns `'entry'`, under 10000 returns `'mid'`, anything else returns `'top'`.

> Edge cases matter. What should `bandFor(5000)` be? Under 5000 is false, under 10000 is true, so it's `'mid'`. The checks test the edges.
