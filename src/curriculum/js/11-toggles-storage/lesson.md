Most dashboards have a toggle: 1Y / 5Y / 10Y on the Larkfield portal, months on Ashgrove, scenarios on the cash forecast. They all follow the same pattern as the last lesson, plus one extra: remembering your choice.

## One variable, one render

```js
let period = '1Y';

function render() {
  const { start, end } = history[period];   // pull two values out of an object
  figure.textContent = money(end);
  // ...and mark the right button as pressed
}
```

`history[period]` uses **square brackets** to look up a property whose name is in a variable. `history['5Y']` and `history.5Y` aren't the same: the dot version doesn't work for names like `5Y`.

## aria-pressed

Toggle buttons say whether they're pressed with `aria-pressed="true"` or `"false"`. Screen readers announce it, and the stylesheet uses it to fill the active button. It's what well-built dashboards do.

## Remembering with localStorage

```js
localStorage.setItem('nm-period', '5Y');   // save (always a string)
localStorage.getItem('nm-period');         // read: '5Y', or null if nothing saved
```

`localStorage` keeps small bits of text in this browser, for this site, until someone clears it.

Two rules from real projects:

1. **Wrap it in try/catch.** Private windows and strict settings can make it throw. The toggle must still work.
2. **Never trust what comes back.** Check the saved value is one you expect (`saved in history`) before using it.

## Your turn

1. Fill in `render()`: show `money(end)` in the figure, the line **Up $690,000 (9%) over 1Y** in `.db-change` (round the percentage), and set `aria-pressed` on every button.
2. Make each button set `period`, save it under the key `nm-period`, and render.
3. On load, restore a saved period if it's valid, inside a try/catch.

Test it: pick 5Y, then press the reload button above the preview.
