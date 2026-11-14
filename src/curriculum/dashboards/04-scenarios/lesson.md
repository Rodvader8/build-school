Charts show what happened. A scenario shows what *could* happen: "What if we hire someone in March?" It's the feature owners ask for once a dashboard has won them over, and it's what a good scenario tool is really selling: a way to try a decision before making it.

## Keep the maths out of the component

A forecast is arithmetic, and arithmetic should be easy to test. So it lives in a plain function, `forecastCash`, with no React in sight:

```js
forecastCash({ opening: 50000, months: 12, revenue: 40000, growth: 0, costs: 38000,
               hire: { salary: 6000, startMonth: 3, rampMonths: 2, extraRevenue: 5000 } })
// [{ month: 1, income: 40000, outgoings: 38000, balance: 52000 }, ...]
```

Each month: `balance = previous balance + income - outgoings`. A hire changes two things, and at different times. They **cost** money from `startMonth`, and they **earn** money only once they've ramped up, `rampMonths` later. That gap is the whole point, because it's what makes the cash dip before it recovers.

The tests work the sums out by hand. When a calculation matters, write down a case you can check on paper first, then make the code agree.

Two small helpers answer the questions an owner actually asks: `lowestBalance` ("how bad does it get?") and `cashOutMonth` ("do we run out?").

## A toggle that does more than look pretty

The panel needs just three pieces of state: is the hire switched on, what's the salary, and when do they start. Everything else is **derived**: the baseline, the with-hire forecast, the low point, the warning. You recalculate them every render. It's cheap, and it can't go out of sync.

Use a proper switch for the toggle: a `<button role="switch" aria-checked={on}>`. Screen readers announce it as "What if we hire? switch, off". And the status line, `role="status"`, gets read out when it changes, so a keyboard user hears "Cash runs out in month 6" as they type the salary.

## Two lines, one chart

The chart always draws the baseline. When the switch is on it adds a second line. Seeing the two together is more useful than seeing either alone. Both come from the same function, so the chart can't tell a different story from the numbers.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. You'll see a flat baseline and nothing to click.
2. Open `tests/scenario.test.jsx`. The first six tests are the sums.
3. Write `forecastCash`, `lowestBalance` and `cashOutMonth` in `src/forecast.js`. Start with the no-hire case and add the hire after.
4. Make `src/components/ScenarioPanel.jsx` interactive. The comment at the top lists what it needs.
5. Press **Check my work**.

> Tip: try the salary at $20,000 with the dev server running. Seeing the "Cash runs out" warning appear is when the toggle starts to feel like a product.
