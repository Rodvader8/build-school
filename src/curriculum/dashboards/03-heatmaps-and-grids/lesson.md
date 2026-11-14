A heatmap shows where the action is. Which rooms fill up on Saturdays? Which hours are over-staffed? A table of 56 numbers hides the answer, but the same table shaded by size shows it at a glance. Occupancy and rostering views in most dashboards are built this way.

## It's a table first

A good heat grid isn't a picture, it's a real `<table>` with shaded cells. That gives you, for free:

- Row and column headers a screen reader can announce.
- A number in every cell, so colour is never the *only* way to read it.
- Keyboard and copy-paste behaviour people already know.

Each cell also gets an `aria-label` that says it in words: "Terrace, Sat: 100% of seats booked".

## The scale

One small function turns a number into a **step**:

```js
heatLevel(50, 100)  // 2  (the middle of five steps)
```

The scale runs from 0 to the biggest value in the grid, cut into equal slices. The step then picks a class: `bg-heat-0` (quietest) to `bg-heat-4` (busiest). Two details matter:

- **Classes, never styles.** Tailwind generates CSS only for class names it can *see* in your source, so `HEAT_CLASSES` lists all five in full. Building `'bg-heat-' + level` would be invisible to it. And inline `style={{ background }}` is off the table.
- **Sequential colour.** One hue, going from dark to bright. Lightness carries the meaning, so it still reads for people who can't tell the hues apart.

## Text that stays readable

A number on a shaded cell has to pass **contrast**: WCAG wants 4.5 to 1 for body-sized text. Dark cells get light text, bright cells get dark text, and one of the tests reads your colour tokens and checks every step.

## The key

A legend says what the colours mean, in words: "Quieter" at one end, "Fuller" at the other. Without it a heatmap is a colour puzzle.

## Reuse

The occupancy heatmap and the labour grid are the same component with different data and different sentences. `HeatGrid` takes a `describe` function so each one can phrase its cells properly. That's the pattern to keep: the grid knows nothing about rooms or rosters.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `tests/heat.test.jsx`.
3. Write `heatLevel` in `src/heat.js`.
4. Build `src/components/HeatLegend.jsx`.
5. Build `src/components/HeatGrid.jsx`. The occupancy and labour views are waiting for it.
6. Press **Check my work**.

> Tip: put the busiest value in the data at exactly the max, and check it lands on the top step. Off-by-one at the top of a scale is the classic heatmap bug.
