The Larkfield client portal has a table of every entity a family owns, and you can sort it by any column and filter it as you type. This lesson builds exactly that, and introduces the most important idea in front-end code.

## State, then render

Don't fiddle with the rows directly. Keep a small object describing **what the table should show**, and one function that draws the table from it:

```js
const state = { key: null, dir: 'ascending', query: '' };

function render() {
  // 1. start from the data, 2. filter, 3. sort, 4. draw
}
```

Every click or keystroke just changes `state` and calls `render()`. This is exactly how React works, so you're learning it here first.

## Filtering

```js
const rows = entities.filter((e) => e.name.toLowerCase().includes(query));
```

`filter` keeps the items where the function returns `true`. Lower-casing both sides makes "trust" match "Trust".

## Sorting

```js
rows.sort((a, b) => a.value - b.value);              // numbers, smallest first
rows.sort((a, b) => a.name.localeCompare(b.name));   // text, A to Z
```

The compare function returns a negative number if `a` comes first, positive if `b` does. Multiply by `-1` to flip the direction.

## Telling everyone the order

`aria-sort` on the header (`ascending`, `descending` or `none`) tells screen readers how the table is sorted. The stylesheet also uses it to draw the arrow.

`th.dataset.key` reads the header's `data-key` attribute. `data-` attributes are the standard way to stash a little information on an element for your script.

## Your turn

1. In `render()`, filter by `state.query` and, if `state.key` is set, sort by it in `state.dir`.
2. Make each header button sort by its column. Clicking the same header again flips the direction. Set `aria-sort` on the clicked header and `none` on the others.
3. Make typing in the filter box update `state.query` and redraw.
