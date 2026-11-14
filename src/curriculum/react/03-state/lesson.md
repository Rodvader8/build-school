In the JavaScript track you wrote a table lesson that kept one `state` object and called `render()` after every change. React is that idea, built in. You describe what the page looks like **for the current state**, and React redraws it whenever the state changes. You never touch the DOM yourself.

## A variable that remembers

An ordinary variable inside a component resets every time the component runs. State doesn't:

```jsx
import { useState } from 'react';

const [period, setPeriod] = useState('1Y');
```

`useState('1Y')` returns a pair: the **current value** and a **setter**. The first time, `period` is `'1Y'`. Call `setPeriod('5Y')` and React re-runs your component, and this time `period` is `'5Y'`.

## Events set state, state drives the page

```jsx
<button aria-pressed={p === period} onClick={() => setPeriod(p)}>
  {p}
</button>
```

- `onClick` takes a **function**. Write `() => setPeriod(p)`, not `setPeriod(p)`, or it runs during render.
- `aria-pressed={p === period}` isn't "if pressed, do something". It states what is true for the current render. React fixes the DOM to match.

That's the whole loop: **event, set state, render**. It's the same one you wrote by hand with `state` and `render()`, with React doing the rendering.

## What belongs in state

Keep state **minimal**. The period is state, because it's the one thing a click changes. The change in dollars and the percentage aren't, because you can always work them out from the period:

```jsx
const { start, end } = history[period];
const percent = Math.round(((end - start) / start) * 100);
```

If you stored `percent` in state too, you'd have two things to keep in step, and sooner or later they'd disagree.

## Rules of hooks

`useState` is a **hook**. Hooks must be called at the top of a component, never inside an `if`, a loop or a nested function, so React can match each call to its stored value.

## Each copy has its own state

Render `<NetWorth />` twice and each has its own `period`. State belongs to the place where the component sits on the page, not to the function.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The buttons do nothing yet.
2. Open `src/components/NetWorth.jsx`. Replace the fixed `period` with `useState('1Y')`.
3. Add `aria-pressed` and an `onClick` to each period button.
4. Add a second state value, `showNote`. A button labelled **How this is worked out** (with `aria-expanded`) shows or hides the sentence "The change is measured from the value at the start of the period."
5. Press **Check my work**.

> Tip: if the page doesn't update when you click, you've probably changed a plain variable. Only the setter from `useState` makes React redraw. (The starter builds its buttons with `.map`. Lesson 5 explains it properly.)
