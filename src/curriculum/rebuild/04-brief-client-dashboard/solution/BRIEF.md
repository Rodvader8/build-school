# Brief: the Crumb and Co. orders dashboard

A client dashboard for an invented wholesale bakery. Build it with React, Vite and Recharts, write your own tests, then run the gate (`npm run gate`) until every line says PASS. The best dashboards are the standard: quick to read, honest about their numbers and usable without a mouse.

## The business

Crumb and Co. bakes bread, pastries and cakes for about forty cafes, delis and restaurants. The owner reads one page every morning to answer a single question: how are orders going, and who's driving them?

## The audience

One person at a desk, and sometimes the same person on a phone in the car park at 5am. They know their numbers well, so they spot a wrong one instantly. They don't want ornament.

## The page

One `h1` (the business name) and a **period toggle** for 7, 30 and 90 days, starting on 30. Then:

- **Four KPI tiles:** revenue, orders, average order and repeat customers. Each shows its value and how it moved against the period before, in words ("Up 4.6% on the period before"), not by colour alone.
- **A chart** of revenue across the period. It's a named `figure`, the drawing is `role="img"` with a sentence for its `aria-label` (what's highest, what's lowest), and the same numbers sit beside it as a real `table` with at least four rows.
- **A sortable customers table:** customer, orders, revenue and last order. It starts unsorted. A click on a column header sorts ascending, a second click sorts descending, and `aria-sort` says which. The headers are real `button`s, so the keyboard works. The table scrolls sideways inside its own box on a narrow screen, without scrolling the page.

Changing the period changes the tiles, the chart and the table.

## The content

All the numbers and names are in `src/data.js`. Don't type a figure into a component. The head details (title, description, URL) are in there too, for you to use in `index.html`.

## The assets

`src/assets/fonts` has Geist. `public/og.jpg` is the share image. This is a public demo, so the page is indexable.

## Hooks the gate looks for

The gate has to find your tiles and your toggle. Mark each KPI tile with `data-testid="kpi"`, and make each period button a `<button aria-pressed>`.

## Tests

Write at least six of your own in `tests/`, using Vitest and Testing Library. Cover what can break: the figures for each period, the toggle, sorting both ways, and the chart's name and table. They run with `npm test`, and the gate runs them too.

## Must-haves

- A Content-Security-Policy in `netlify.toml`, and a page that loads under it.
- A skip link, one `main` landmark and a visible focus style on everything you can tab to.
- Nothing animated that a visitor with reduced motion would feel.
- No `style` attributes and no `style={{ }}` props. Classes only.
- The head has a canonical link, Open Graph tags (JPG `og:image`) and JSON-LD.
- Fonts are self-hosted.
