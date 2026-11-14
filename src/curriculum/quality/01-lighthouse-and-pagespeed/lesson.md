When Google ranks your pages, and when a visitor decides whether to wait, speed counts. **Lighthouse** is the tool that measures it. It loads your page in Chrome under controlled conditions and scores performance, accessibility, SEO and best practice from 0 to 100. **PageSpeed Insights** is the same engine, hosted by Google, with real-visitor data added when your site has enough traffic.

This lesson is about using Lighthouse *properly*, which mostly means not trusting a single number.

## Lab data and field data

- **Lab data** comes from one simulated visit on one machine, under throttled network and CPU. It's repeatable enough to compare a change before and after.
- **Field data** is what real visitors experienced over the last 28 days. It's the number Google actually uses.

Lighthouse gives you lab data. Use it to find problems and check fixes. Use field data to judge how the site really performs.

## Always audit a local page

Run Lighthouse on a copy of the page on your own machine, such as the dev server in this lesson. Never point it at a live client site repeatedly. Every run loads the page, which fires their analytics and inflates their visitor numbers, and you can't change a live page to test an idea anyway. PageSpeed Insights is fine for a one-off look at a public URL. Everything else happens locally.

## One run is noise

Run the same page twice and you'll often get two different scores. Something else on the machine used the CPU, a timer fired late, the network blipped. A score of 91 then 84 doesn't mean the page changed. So never quote a single run.

The page in this lesson is tiny, so its score will probably say 100 every time. Look at the LCP in `report.json` instead: it wobbles by a few milliseconds between runs even here. On a heavier page the wobble is much bigger.

The rule: **run it three times and quote the median**, the middle value after sorting. A median shrugs off one freak result in a way an average can't. Show the spread too (best minus worst). A spread of 2 says "trust this number" and a spread of 15 says "something is making this unstable, find it first".

```js
const sorted = [...values].sort((a, b) => a - b);
const mid = Math.floor(sorted.length / 2);
return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
```

Note `[...values]` copies the list first, so you don't reorder your caller's data, and the `(a, b) => a - b` makes it compare *numbers*. Without it, JavaScript sorts `[10, 9, 100]` as text and puts 100 before 9.

## The four numbers

| Metric | What it means |
|---|---|
| **score** | Lighthouse's overall 0 to 100 |
| **LCP** (ms) | When the biggest thing on screen appeared |
| **TBT** (ms) | How long the page was too busy to respond |
| **CLS** | How much the layout jumped around |

The next lesson shows how to move each one.

## Your turn

Everything is installed by the lesson's `npm install`. Lighthouse uses the Chromium that Playwright already downloaded, so there's no browser to fetch.

1. Open `median.mjs` and write `median(values)`.
2. Open `measure.mjs`. It audits once and quotes that one run. Change it to run three audits in a row, one after another, and build the report.
3. Run `node measure.mjs` in the terminal. It takes about half a minute and writes `report.json`.
4. Press **Check my work**.
