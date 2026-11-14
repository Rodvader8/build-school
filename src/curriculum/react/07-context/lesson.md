A dashboard has one period toggle and a dozen things that care about it: the headline figure, the chart, the table, the page title. You *can* pass `period` down through every component in between as a prop, but it gets tedious fast, and the components in the middle that don't care about it still have to carry it. This is called **prop drilling**. Context is the fix.

## Three pieces

```jsx
// 1. A context: a named channel
const PeriodContext = createContext(null);

// 2. A provider: puts a value on the channel for everything inside it
function PeriodProvider({ initial = '1Y', children }) {
  const [period, setPeriod] = useState(initial);
  return <PeriodContext value={{ period, setPeriod }}>{children}</PeriodContext>;
}

// 3. A hook: lets any component inside read the channel
function usePeriod() {
  return useContext(PeriodContext);
}
```

Any component below `<PeriodProvider>`, at any depth, can now call `usePeriod()` and get `{ period, setPeriod }`. When `setPeriod` runs, every component that read the context renders again with the new value.

In React 19 you render the context itself as the provider (`<PeriodContext value={...}>`). Older tutorials write `<PeriodContext.Provider value={...}>`, which you'll still see.

## Wrap it in a hook

Components import `usePeriod`, not the raw context. That gives you one place to add a guard, so a mistake fails loudly:

```jsx
export function usePeriod() {
  const value = useContext(PeriodContext);
  if (value === null) throw new Error('usePeriod must be used inside a PeriodProvider');
  return value;
}
```

The `null` default is deliberate. Without a provider, an unhelpful "cannot read properties of undefined" turns up somewhere far away.

## When to use it, and when not to

Context suits things many components need and that change rarely, like the signed-in user, the theme or the selected period.

It's **not** a replacement for props. If only a parent and its direct child share a value, pass a prop. It's easier to follow, and you can see where the data comes from. Reach for context when you're passing the same prop through three or four layers that don't use it.

Also remember that **everything that reads a context renders again when its value changes**. Keep each context small and focused rather than one giant "app state".

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Nothing works until the context exists.
2. In `src/period-context.jsx`, build the context, `PeriodProvider` (with an `initial` prop that defaults to `'1Y'`) and `usePeriod` with its guard.
3. In `src/components/PeriodToggle.jsx`, render a button for each period using `usePeriod()`. Look at `Summary.jsx` to see how a consumer reads it.
4. In `src/App.jsx`, wrap the page in `<PeriodProvider>`.
5. Press **Check my work**.

> Tip: notice that `Summary` and `Breakdown` take no props at all. They only know the period because they asked for it.
