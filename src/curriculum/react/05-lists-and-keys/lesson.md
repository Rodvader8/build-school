Every dashboard has lists: a table of entities, a feed of events, a row of period buttons. In the JavaScript track you built them with `document.createElement` and a loop. In React you map an array of data to an array of JSX, and React turns it into rows.

## Map data to markup

```jsx
<ul>
  {entities.map((entity) => (
    <li key={entity.id}>{entity.name}</li>
  ))}
</ul>
```

`.map()` returns a new array, and React knows how to render an array of elements. The list **is** the data. Add an entity to the array and a row appears, with no extra code.

## Keys say who is who

When the list changes, React has to decide which old row matches which new row. The `key` is how it matches them. It must be:

- **unique** among its siblings,
- **stable**, meaning the same item has the same key every time,
- and **not the index**, unless the list never reorders.

Why not the index? Imagine two rows, each with a text box. You type a note in row 1, then reverse the list. With `key={index}`, React sees "row 0 is still row 0" and keeps the old text box in place, so your note now sits beside the wrong entity. With `key={entity.id}`, React moves each row, text box and all, to its new place.

That's the bug the tests look for. If the data doesn't come with an id, give it one when you create it, because you can't invent one safely during render.

## Filtering and ordering are just array methods

You already know these from the sort and filter lesson:

```jsx
const matches = entities.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
const shown = reversed ? [...matches].reverse() : matches;
```

Two things to notice:

1. `.reverse()` and `.sort()` change the array **in place**. Never do that to props or state. Copy first with `[...matches]`.
2. `query` and `reversed` are the only state. `matches` and `shown` are worked out on each render. It's the "state, then render" pattern again.

## The empty case

A list that can come up empty needs to say so. Otherwise users think the page is broken. `{shown.length === 0 && <p>...</p>}` is enough.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `src/components/EntityList.jsx`. Make `shown` filter by `query` (ignoring capitals) and reverse when `reversed` is true, without changing `entities`.
3. Change `key={index}` to `key={entity.id}`. Try it first: type a note in the first row, press **Reverse order**, and watch where the note ends up.
4. Show `No entities match "zzz"` when the filter finds nothing.
5. Press **Check my work**.

> Tip: React warns in the console when a list has no keys at all. A wrong key, like an index, gets no warning. That's why the tests check the behaviour.
