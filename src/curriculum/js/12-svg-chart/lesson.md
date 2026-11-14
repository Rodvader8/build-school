Chart libraries are handy, but every chart is just shapes placed by maths. Drawing one by hand teaches you what Recharts does for you later, and lets you build charts no library offers, like the scroll-built dashboard on Ashgrove.

## SVG

SVG is a drawing language that lives in your HTML. You already have an empty one:

```html
<svg class="db-chart" viewBox="0 0 600 240" role="img" aria-label="...">
```

`viewBox="0 0 600 240"` sets up a drawing area 600 units wide and 240 tall, which then scales to fit any screen. Coordinates start at the **top left**, and y goes **down**.

## Making SVG elements

SVG elements need their own namespace, so use `createElementNS`:

```js
const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
bar.setAttribute('x', '10');
bar.setAttribute('y', '40');
bar.setAttribute('width', '30');
bar.setAttribute('height', '200');
chart.append(bar);
```

## The maths

1. Find the biggest month: `Math.max(...revenue.map((r) => r.amount))`. The `...` spreads the array into separate values.
2. Each bar's height is its share of the biggest: `amount / max * (HEIGHT - TOP)`.
3. Bars grow **up** from the bottom, so `y = HEIGHT - height`.
4. Each month gets an equal slot: `WIDTH / 12`. Leave a small gap between bars.

`forEach((r, i) => ...)` gives you each item and its position `i`, which is how you work out `x`.

## Accessible charts

A picture of numbers is useless to a screen reader. The `svg` already has `role="img"` and a label. Give each bar a `<title>` too, like **Nov: $72,000**. Browsers also show it as a tooltip when you hover.

## Your turn

Draw twelve bars, one per month, scaled so the biggest month (November) reaches `TOP`, each with a `<title>`.
