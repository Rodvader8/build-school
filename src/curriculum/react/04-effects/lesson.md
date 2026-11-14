Rendering should be a pure calculation: the same props and state in, the same markup out. But pages also have to talk to things React doesn't control, such as the browser tab title, a timer, a network request or a map widget. Effects are where that happens.

## What an effect is

```jsx
useEffect(() => {
  document.title = `Net worth, ${period} | Kestrel`;
}, [period]);
```

React renders your component, puts the result on the page, **then** runs the effect. The array at the end lists everything the effect reads. React re-runs the effect only when one of those values changed. An empty array `[]` means "once, when the component first appears".

## Cleanup

Effects that start something must stop it, or you leak:

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

The function you **return** is the cleanup. React runs it before the effect runs again and when the component leaves the page. Without it, every visit to the page leaves a timer behind, still updating state for a component that's gone. The same applies to event listeners, subscriptions and anything else you start.

In development, `<StrictMode>` (it wraps the app in `main.jsx`) starts every effect, cleans it up and starts it again, on purpose. If your effect has a leak, you see the bug straight away.

## You might not need an effect

Most effects in beginners' code shouldn't exist. The usual culprit:

```jsx
// Don't: state copied from other state
const [percent, setPercent] = useState(0);
useEffect(() => setPercent(compute(period)), [period]);
```

This renders once with the old value, runs the effect, then renders **again**. Work the value out in the body instead:

```jsx
const percent = compute(period);
```

A good test: **does this talk to something outside React?** If not, you don't need an effect. Two more cases that don't:

- **Responding to a click.** Put the logic in the click handler, not in an effect that watches state.
- **Transforming data for display.** Sorting, filtering and formatting happen during render.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `src/components/NetWorth.jsx`. Delete the `change` state and its effect, and work out `diff` and `percent` in the function body.
3. Add an effect that sets `document.title` to `Net worth, 5Y | Kestrel` (using the current period) whenever the period changes.
4. Open `src/components/Clock.jsx`. Its timer is never stopped. Return a cleanup function that clears it.
5. Press **Check my work**. One test counts how many times the card renders per click, and another counts live timers after the clock unmounts.

> Tip: the checks use fake timers, so nothing waits a real second. You can read how in `tests/effects.test.jsx`.
