A component that always shows the same thing isn't much use. Props are how you reuse one component with different data: the label, the number, the colour. If you've written a JavaScript function with parameters, you already understand them.

## Props are the function's argument

```jsx
function Greeting({ name }) {
  return <p>Hello, {name}</p>;
}

<Greeting name="Mia" />
```

Attributes on the tag become properties on **one object**, and the component receives it as its only argument. `{ name }` in the parameter list is JavaScript destructuring, the same as you used with objects.

## Anything can be a prop

```jsx
<KpiCard label="Net worth" value={8080000} change={4.2} />
```

Strings can use quotes. Everything else (numbers, booleans, arrays, objects, even functions) goes in curly braces: `value={8080000}`. Passing `"8080000"` would give the component a string, and `"8080000" + 1` is `"80800001"`.

## Optional props and defaults

A prop you don't pass is `undefined`. That's useful: it lets one component handle both cases.

```jsx
{change !== undefined && <p>Up {change}%</p>}
```

When the left side is `false`, React renders nothing. You can also give a prop a default in the destructuring: `function Tag({ colour = 'cyan' })`.

## children

Whatever you put between the opening and closing tags arrives as `children`:

```jsx
<KpiCard label="Savings" value={96500}>
  <p>Target: $120,000</p>
</KpiCard>
```

Render it wherever it belongs with `{children}`. This is how you build wrappers like cards, panels and layouts.

## Props are read-only

A component must never change its own props. Data flows **down**: a parent decides, a child displays. When something needs to change, that's state, which is the next lesson.

## Derive, don't duplicate

The card gets one number, `change`, and works out the rest in the function body: the word ("Up" or "Down"), the colour class and the sign. Don't ask the parent to pass all three. Fewer props means fewer ways to get them out of step.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Every card says "Label" and "$0".
2. Open `src/components/KpiCard.jsx`. Destructure `label`, `value`, `change` and `children`.
3. Show the label, and the value formatted as dollars with `toLocaleString('en-AU')`.
4. Show the change line only when `change` was passed. Say "Up 4.2%" or "Down 1.5%", and add `is-up` or `is-down` to the class.
5. Render `{children}` at the bottom of the card.
6. Press **Check my work**.

> Tip: read `tests/kpi-card.test.jsx` before you start. It's the specification.
