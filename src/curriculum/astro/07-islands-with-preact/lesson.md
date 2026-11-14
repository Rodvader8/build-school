Most of a business site is not interactive: headings, photos, a price list, a contact block. A few bits are: a quote calculator, a filterable gallery, a booking widget. Astro's answer is **islands**. The page is static HTML, and only the interactive pieces become small apps that "wake up" in the browser.

## Why not make everything React?

A site built entirely as a client-side app sends all its JavaScript up front, even for text that never changes. With islands, a page with one slider ships the code for one slider.

You can use React, Vue, Svelte, Solid or Preact for an island. This course uses **Preact**: the same component style as React (hooks, JSX), but about a tenth of the size, which suits a marketing site.

## Adding Preact

Normally you'd run `npx astro add preact`, which installs the packages and edits the config. The starter already lists the packages in `package.json`, so you only need to make the config change by hand, which is worth seeing once:

```js
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  integrations: [preact()],
});
```

Until you do, Astro doesn't know how to handle `Estimator.jsx`. Run a build and it stops with an error about `react/jsx-runtime`, because without the integration it assumes JSX means React.

## A component with state

```jsx
import { useState } from 'preact/hooks';

export default function Estimator({ price, unit }) {
  const [qty, setQty] = useState(6);
  const total = price * qty;
  return (
    <div class="estimator">
      <input type="range" value={qty} onInput={(e) => setQty(Number(e.currentTarget.value))} />
      <p>{qty} x ${price.toFixed(2)} = ${total.toFixed(2)}</p>
    </div>
  );
}
```

Hooks come from `preact/hooks`. Props arrive as a normal object. The CSS lives in your stylesheet and the JSX uses `class`. No `style={{}}`, ever, here either.

## Telling Astro when to wake it up

Using the component in a page isn't enough on its own:

```astro
<Estimator price={9} unit="loaf" />
```

That renders the component to HTML **at build time** and stops, so the slider appears but doesn't move. Add a `client:` directive to make it an island:

| Directive | Loads the JavaScript |
|---|---|
| `client:load` | straight away |
| `client:idle` | once the browser has gone quiet |
| `client:visible` | when it scrolls into view |

Use `client:visible` unless there's a reason not to. A slider halfway down the page costs nothing until someone gets there. The first paint is still the server-rendered HTML, so there's no blank gap.

## Your turn

1. Run `npm install` in the terminal below, then run `npm run build`. Read the error about `react/jsx-runtime`.
2. Add the Preact integration to `astro.config.mjs`, then press **Start dev server**. The slider shows, but the total says `$0.00` and the slider is frozen.
3. In `src/components/Estimator.jsx`, fix `total` so it's price times quantity.
4. In `src/pages/index.astro`, add `client:visible` to `<Estimator>`. Now the slider moves.
5. Press **Check my work**.

> Tip: view the page source (not DevTools) after a build. The total is already there in the HTML. That's server rendering, and it's why the page is fast and search engines can read it.
