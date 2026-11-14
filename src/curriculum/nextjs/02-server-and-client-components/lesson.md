By default, every component in the Next.js App Router is a **server component**. It runs on the server, can read files and databases, and sends the browser plain HTML with no JavaScript for that component. That's why a Next page can load so fast, and why a lot of the code in a Next site never reaches the visitor at all.

A **client component** is one that needs the browser: state, click handlers, effects. You opt in with a line at the very top of the file:

```jsx
'use client';
```

## The rule of thumb

Ask what the component needs.

| It needs | It is |
|---|---|
| Only props and markup | a server component (the default) |
| `useState`, `useEffect`, `onClick`, `localStorage` | a client component |
| A database, a secret, a big library | a server component, so none of it ships |

Keep the client parts **small and low in the tree**. Everything a client file imports becomes part of the client bundle too, so a `"use client"` on a whole page drags the page's data and helpers along with it.

## Props cross a line

A server component can render a client component and hand it props. Those props have to travel to the browser, so they're serialised into the page. Anything you pass is visible to the visitor, even if the client component never displays it.

```jsx
// server: build a safe copy, then pass it
const items = menu.map(({ supplierNote, ...publicFields }) => publicFields);
return <MenuBrowser items={items} />;
```

## What's wrong with the starter

`app/menu/page.jsx` is one big client component. It needs the filter buttons, so someone put `"use client"` on the whole page. The result: the supplier notes in `lib/menu.js` get shipped to every visitor. Open the page source in the browser (view-source) and search for "wholesale". You'll find it.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `tests/components.test.jsx`. It describes what the finished pieces do.
3. Create `components/AddToOrder.jsx`: a client component with a counter and an "Add" button. The button says "Add", but give it an `aria-label` of "Add <item> to order" so a screen reader knows which loaf it's for.
4. Create `components/MenuBrowser.jsx`: a client component that takes `items`, keeps the chosen category in state and renders a `ProductCard` with an `AddToOrder` for each item that matches.
5. Rewrite `app/menu/page.jsx` as a server component: strip `supplierNote` from every item, then render `<MenuBrowser items={...} />`.
6. Press **Check my work**. It reads your files and the built output, including the browser JavaScript, to prove the notes stay on the server.

> Tip: if you're not sure whether a file needs `"use client"`, leave it off. Next will tell you in an error the moment you use a hook in a server component, and the fix is one line.
