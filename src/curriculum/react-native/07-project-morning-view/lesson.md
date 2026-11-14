Time to put the track together. A hotel owner wants a phone view of the morning: how full the hotel is, who's arriving today, and a switch to see only the early arrivals. Every piece uses something you've learned.

## What you're building

```
Good morning
  75%
  18 of 24 rooms occupied
  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○

  Early arrivals only (before 2pm)          [ switch ]
  6 arrivals

  Tom Hartley    Room 7          09:45
  Priya Nair     Loft            11:30
  ...
```

The data's in `data/morning.js`. A real app would fetch it, but that's a separate job, and the screen doesn't care where its numbers come from.

## Plan in layers

Build from the bottom up and run **Check my work** as you go. Each layer is easy to test because it doesn't know about the one above.

1. **`lib/summary.js`** holds three plain functions: the occupancy percentage, sorting arrivals by time, and filtering to the early ones. No React in it. They're the easy wins, and the screen depends on them.
2. **`components/OccupancyCard.jsx`** shows the number and one dot per room. Occupied dots are filled, free ones faint. Two named styles (`dotOn`, `dotOff`) do it, so no style is built on the fly in the JSX.
3. **`app/index.jsx`** is the screen. It holds one piece of state, `earlyOnly`, and works out the visible list from it.

## State, once

It's tempting to keep both the full list and the filtered list in state, and update both when the switch flips. Don't. Two copies drift apart. Keep the one fact that changes (`earlyOnly`) in state, and *derive* everything else while rendering:

```jsx
const shown = sortByArrival(earlyOnly ? earlyArrivals(arrivals) : arrivals);
```

The count line ("3 arrivals") and the list both come from `shown`, so they can't disagree.

## Rules this project follows

- Lists are a `FlatList`, keyed by the booking reference.
- Every style lives in a `StyleSheet.create` block. None in the JSX.
- Colours come from `theme.js`.
- The Switch has an `aria-label`, because a bare switch tells a screen-reader user nothing.
- The empty state ("No early arrivals") is designed, not forgotten.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `tests/morning.test.jsx` and read it top to bottom. It's your spec.
3. Write the three functions in `lib/summary.js`.
4. Build `components/OccupancyCard.jsx`.
5. Finish `app/index.jsx`: the toggle, the derived list, the count and the `FlatList`.
6. Press **Check my work** after each step. Fix one failure at a time.

> Stretch: add a second `Switch` for "Show unpaid only", or open a guest's details with the navigation you built earlier. Once the checks are green, the structure makes both easy.
