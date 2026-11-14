The Brightwater owner's dashboard has a 14-night room grid: every room down the side, every night across the top, booked nights blocked out. This project builds it from data, using everything in this track.

## The brief

The starter gives you `rooms` (each with a nightly `rate` and the night numbers already `booked`, counting from 0) and a `money` function.

Build into `.tw-grid`:

1. **For each room:** a `p` with the room's name, then **14 cells**, one per night.
2. **Cells are buttons** (`type="button"`, class `tw-cell`), so they work with a keyboard for free. Give each an `aria-label` like "Garden Room, night 3, $380".
3. **Booked nights:** add the class `is-booked` and make the button `disabled`, so it can't be chosen.
4. **Free nights toggle** when clicked: the class `is-selected` and `aria-pressed` go on and off together.
5. **The summary** updates on every click: `.tw-nights` shows how many nights are selected, and `.tw-total` shows the total of their rates, like **$900**.

The stylesheet already lays out the grid and colours booked and selected cells.

## How to approach it

Plan before you type, like a pro:

- What's the **state**? (Hint: which room-and-night pairs are selected. A `Set` is perfect: it holds each value once, with `add`, `delete`, `has` and `size`.)
- What does **render** need to show? (The cell classes and the summary.)
- What **events** change the state? (Clicks on free cells.)

Build it in that order, and test each step in the preview before the next.

> This is the same shape as a real booking engine, minus the server. When you reach the Dashboards track, this grid gets real data from Supabase.
