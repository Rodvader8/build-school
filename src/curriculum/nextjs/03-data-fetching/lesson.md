In Next.js, a page can read its data right where it's rendered. No `useEffect`, no loading flags: the component is an `async` function, and it `await`s. That's how a Next site keeps its pages light. The data work finishes on the server before the visitor sees anything.

## Fetch in a server component

```jsx
export default async function MenuPage() {
  const menu = await getMenu(); // a database call, a file read, or fetch('https://...')
  return <ul>{menu.map(...)}</ul>;
}
```

In this lesson, `lib/bakery-api.js` plays the part of a remote API: every function waits a moment before answering. You'd swap in `fetch()` or a database client without changing the page.

## Next 16 caching in one idea

Next 16 turns the old defaults upside down. Nothing is cached unless you say so, and your config (`cacheComponents: true`) makes the build check every await. For each piece of data you choose one of two things:

| The data | You do | What the visitor gets |
|---|---|---|
| The same for everyone, rarely changes | Cache it with `'use cache'` | It's in the prebuilt page |
| Different per request, or changes constantly | Wrap the component in `<Suspense>` | The page loads, this part streams in |

If you do neither, `next build` fails and tells you which route is blocking. That's a feature: no more accidental slow pages.

## "use cache"

```js
import { cacheLife, cacheTag } from 'next/cache';

export async function getMenu() {
  'use cache';          // must be the first line in the function
  cacheLife('hours');   // how long the copy stays fresh
  cacheTag('menu');     // a name, so you can refresh it on demand later
  return fetchTheMenu();
}
```

Arguments become part of the cache key, so `getItem('rye')` and `getItem('focaccia')` are cached separately. Later, `revalidateTag('menu', 'max')` in a route handler or server action marks the copy stale without a redeploy.

## Suspense for live data

```jsx
<Suspense fallback={<p>Checking the oven...</p>}>
  <OvenStatus />
</Suspense>
```

The fallback is part of the prebuilt page, and the real answer streams in. Open the built HTML (`.next/server/app/index.html`) after a build and you'll see the fallback text but no live number.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Expect an error overlay: the home page is blocked by live data. That's the starting point.
2. Open `tests/data.test.jsx`.
3. Write `groupByCategory` in `lib/group.js`.
4. In `lib/bakery-api.js`, make `getMenu` cached: `'use cache'`, `cacheLife('hours')` and `cacheTag('menu')`.
5. In `app/page.jsx`, move the oven read into an `OvenStatus` component and wrap it in `<Suspense>` with a fallback that says "Checking the oven...".
6. Press **Check my work**. It builds the site and reads the prebuilt HTML.

> Tip: `cacheLife` takes presets like `'seconds'`, `'minutes'`, `'hours'` and `'days'`. Pick the longest one you'd be happy to explain to the owner when the menu changes.
