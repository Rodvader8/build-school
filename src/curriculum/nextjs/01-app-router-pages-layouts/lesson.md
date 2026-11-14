Every page in a Next.js site is a file in a folder, and the header and footer are written once and wrapped round all of them. That's the App Router in Next.js 16: folders are URLs, and layouts are the frames around them.

In this lesson you'll finish a small site for an invented bakery, Fennel & Co.

## Folders are URLs

Inside `app/`, a folder is a route segment and its `page.jsx` is what's shown there:

| File | URL |
|---|---|
| `app/page.jsx` | `/` |
| `app/about/page.jsx` | `/about` |
| `app/menu/[slug]/page.jsx` | `/menu/sourdough`, `/menu/rye`... |

A page is just a React component with a default export. There's no router config to write.

## Layouts wrap pages

`app/layout.jsx` is the **root layout**. It wraps every page and must contain `<html>` and `<body>`. The page arrives as `children`:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>...</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

A layout in a subfolder, like `app/menu/layout.jsx`, wraps only that folder and everything below it. Layouts don't remount when you move between the pages inside them, so a header keeps its state.

## Links

Use `Link` from `next/link` instead of a plain `<a>`. It looks the same, but navigation happens without a full reload, and Next can load the next page in the background.

## Dynamic segments

A folder name in square brackets is a variable. In Next 16 the value arrives as a **Promise**, so you await it:

```jsx
export default async function ItemPage({ params }) {
  const { slug } = await params;
  ...
}
```

`generateStaticParams` returns the list of slugs to build ahead of time. If a slug isn't in your data, call `notFound()` from `next/navigation` and Next shows `app/not-found.jsx`. A `loading.jsx` beside the page gives the route an instant fallback while it works.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The home page works, but the header is missing and the links are dead.
2. Open `tests/routing.test.jsx`. It's your to-do list in plain terms.
3. In `app/layout.jsx`, add `lang="en"`, a `<header>` with a `<nav>` of three `Link`s (Home, Menu, About), a `<main>` around `{children}`, and a footer.
4. Create `app/about/page.jsx` with one `<h1>`.
5. Create `app/menu/layout.jsx` that shows a short note ("Baked fresh every morning from 5am...") above `{children}`.
6. In `app/menu/page.jsx`, link each item to `/menu/<slug>`. Then create `app/menu/[slug]/page.jsx` with `generateStaticParams`, `await params` and `notFound()`.
7. Add `app/not-found.jsx` with an `<h1>` that says "Page not found".
8. Press **Check my work** as you go.

> Tip: Check my work runs `next build`, which writes to `.next`, while the dev server keeps its own files in `.next/dev`. They won't get in each other's way, so leave the dev server running.
