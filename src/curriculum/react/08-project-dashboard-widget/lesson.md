This is the React version of the dashboard lessons from the JavaScript track, and the sort of widget you'll find on a client portal. A headline figure, a period toggle and a sortable table: the three things nearly every client dashboard starts with.

You've now met every ingredient, so this lesson is mostly assembly. Take it in the order you'd plan it at work.

## 1. State first

Ask what a click can change. Only two things:

| State | Starts as |
|---|---|
| `period` | the saved one from `localStorage`, otherwise `'1Y'` |
| `sort` | `{ key: null, dir: 'ascending' }` |

Everything else is **worked out while rendering**: the weighted return, the sorted rows, which button is pressed. You don't store any of it. That's the "state, then render" idea from the JavaScript track, with React doing the render.

## 2. Props down, events up

`Dashboard` owns the state. It hands values **down** as props (`period`, `rows`, `sort`) and passes **functions** down (`onChange`, `onSort`) so children can ask for a change. `KpiCard` and `PeriodToggle` are done for you, so read them to see what a finished presentational component looks like. You write `EntityTable` and the logic in `Dashboard`.

## 3. Sorting without mutating

```jsx
const rows = sort.key ? [...entities].sort(compare) : entities;
```

Copy before you sort, because `.sort()` changes the array it's called on. Click a header: if it's the same column, flip the direction, otherwise start ascending. The Return column compares `entity.returns[period]`, so it follows the toggle.

## 4. Remember the period

Read it **once**, when the component starts, by giving `useState` a function: `useState(loadPeriod)`. Save it in an effect when the period changes. Both sides sit in try/catch, and a saved value that isn't one of the periods gets ignored. Never trust what comes back from storage.

## 5. Tailwind and accessibility

The styles use the tokens in `src/index.css` (`bg-surface`, `text-muted`...), so you won't write a single colour. Two rules are checked:

- Header buttons need a `focus-visible:` outline. Keyboard users must see where they are.
- Transitions go behind `motion-safe:`.

The table needs a caption (`sr-only` hides it visually but not from screen readers), and every `<th>` carries `aria-sort`, as in the table lesson.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. At first you'll only see the headline figure.
2. Open `tests/dashboard.test.jsx`. It's your to-do list, in plain terms.
3. Build `src/components/EntityTable.jsx`: a caption, four sortable columns, and a Return column that shows the chosen period.
4. In `src/components/Dashboard.jsx`, add the state, the sorting and the storage, and render `PeriodToggle`, `KpiCard` and `EntityTable`.
5. Press **Check my work** as you go. Fix one failing line at a time.

> Tip: build the table with a fixed order first, then add sorting. Passing a few checks early beats writing it all in one go.
