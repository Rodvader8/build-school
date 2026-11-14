A **function** is a named recipe: give it ingredients, it hands back a result. Write it once and use it everywhere. Every dashboard has a small set of them for formatting money, dates and percentages.

## Writing a function

```js
function formatFee(amount) {
  return '$' + amount.toLocaleString('en-AU');
}

formatFee(4400);   // gives back '$4,400'
```

- `amount` is a **parameter**: a name for whatever value gets passed in.
- `return` hands the result back. Code after `return` never runs.
- `toLocaleString('en-AU')` formats a number the Australian way, with commas.

## Arrow functions

A shorter way to write the same thing, used everywhere in modern code:

```js
const withGst = (amount) => Math.round(amount * 1.1);
```

When the body is a single expression, its value is returned automatically.

## A real-world trap

Computers store decimals in binary, so `4400 * 1.1` gives `4840.000000000001`, not `4840`. Money code always rounds. `Math.round()` rounds to the nearest whole number.

## Your turn

1. Write `formatFee(amount)` so that `formatFee(4400)` returns `'$4,400'` and `formatFee(13200)` returns `'$13,200'`.
2. Write the arrow function `withGst(amount)` that adds 10% GST and rounds to whole dollars, so `withGst(4400)` is `4840`.
3. Log `formatFee(withGst(13200))`. You should see `$14,520`.
