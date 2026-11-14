Most phone screens are lists: arrivals, messages, orders. On the web you'd `.map()` an array into elements and let the page scroll. On a phone that's the wrong tool for anything long, because it builds every row at once, even the ones nobody scrolls to. **`FlatList`** is the right one. It draws only the rows near the screen and recycles them as you scroll, so a thousand arrivals cost about the same as ten.

## The three props that matter

```jsx
<FlatList
  data={arrivals}
  keyExtractor={(item) => item.ref}
  renderItem={({ item }) => <ArrivalRow arrival={item} />}
/>
```

- `data` is the array.
- `renderItem` is a function that draws one row. It's handed an object, and the thing you want is `item` on it.
- `keyExtractor` returns a unique string for each row. More on that below.

Two more props make a list feel finished. `ItemSeparatorComponent` draws a divider between rows, and `ListEmptyComponent` shows something sensible when `data` is empty. An empty list is a real state, so give it a message and not a blank screen.

## Why keys matter (it isn't just a warning)

You met keys in React for the web, and it's tempting to see them as something that silences a console warning. They do something real. A key tells React *which row is which guest*, so each row's own state stays attached to the right person.

In this lesson each row remembers whether its guest has been checked in. Now Priya is checked in, and Ben arrives early and jumps to the top of the list. If the list is keyed by **position** (the index), React sees "row 0 changed from Priya to Ben" and reuses row 0's state. Ben now shows as checked in. Priya is shown as not. If the list is keyed by the booking reference, the row follows the guest.

So the rule: the key must come from the data, must be unique, and must never change for the same item. A database id or a booking reference qualifies. The array index doesn't.

> `FlatList` looks for a `key` or `id` field if you don't give it a `keyExtractor`, and falls back to the index if it finds neither. Here the data has a `ref` field, on purpose, so you have to say which one to use.

## When `map` is fine

For a short, fixed list (three settings rows, five tabs) `map` inside a `ScrollView` is simpler and perfectly fine. Reach for `FlatList` when the list is long, grows, or loads from a server.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. It's a list of four guests.
2. Open `tests/list.test.jsx`. Two of the tests re-order the list and check each guest's state followed them.
3. In `components/ArrivalsList.jsx`, replace the `ScrollView` and `map` with a `FlatList`: `data`, a `keyExtractor` that uses `item.ref`, `renderItem`, `ItemSeparatorComponent` and `ListEmptyComponent`.
4. Press **Check my work**.
5. Try it: in `App.jsx`, pass `[]` instead of `arrivals` and see the empty message.
