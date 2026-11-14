A chart is a picture of a table. That's the way to build one: start from the numbers, pick the shape that answers one question, and make sure someone who can't see the picture still gets the answer. Good charts in any dashboard follow the same recipe.

## Recharts in one minute

Recharts draws SVG from React components. You describe the chart, it works out the scales:

```jsx
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={months}>
    <XAxis dataKey="month" />
    <YAxis />
    <Bar dataKey="revenue" />
  </BarChart>
</ResponsiveContainer>
```

`data` is an array of objects. `dataKey` says which field each part reads. `ResponsiveContainer` fills its parent, so the parent needs a height (here `h-72`). This project uses Recharts 2.15, the version on the real dashboards.

## Pick the shape for the question

| Question | Shape | Scale rule |
|---|---|---|
| How do amounts compare? | Bars | Start at zero, always. A bar twice as tall must mean twice the money. |
| How is it trending? | Line | Needn't start at zero. Zoom in on the range that matters. |
| Are we on target? | A dashed `ReferenceLine` | One line, labelled in words. |

## Data to shape

Because charts come from data, you can test them without looking. A bar chart of 12 months has 12 bars. A line has one dot per month. The axis labels are the month names. Your checks count shapes and read labels. They never compare pixels.

## A chart for people who can't see it

An SVG is a poor fit for a screen reader, so every chart gets a frame:

- A `<figure>` named by its `<figcaption>`.
- The drawing as `role="img"` with one sentence: "Revenue by month. Highest in Dec at $84,200, lowest in Feb at $58,900." That's the insight, written down.
- The same numbers as a real `<table>` in a `<details>`, for anyone who wants the detail. Colour-blind people, keyboard users and anyone on a slow connection benefit too.

Colours come from the theme, written as `var(--color-accent)`. Recharts' own `style` props and hex values would drift from the rest of the site, so pass the CSS variables instead.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The page is empty for now.
2. Open `tests/charts.test.jsx`.
3. Write `describeSeries` in `src/chartData.js`.
4. Build `src/components/ChartFigure.jsx`. The bar chart in `RevenueChart.jsx` is finished and waiting for it, so you'll see it appear.
5. Read `RevenueChart.jsx` carefully, then write `LabourChart.jsx` using a line and a reference line.
6. Press **Check my work**. It counts bars and dots, reads the axis labels and checks the description and table.

> Tip: if a chart renders nothing, it's almost always the container. A `ResponsiveContainer` inside a parent with no height draws at 0 pixels tall.
