React is the library behind most modern web apps, and dashboards are exactly the sort of thing it's built for. You already know HTML, CSS and JavaScript. React asks you to organise them differently: instead of one big page, you build small, named pieces and put them together.

## A component is a function that returns markup

```jsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Copyright 2026 Kestrel Coffee</p>
    </footer>
  );
}
```

That's a **component**. The markup-looking part is **JSX**, which is JavaScript with a tag syntax. A build tool (Vite, here) turns it into plain JavaScript before the browser ever sees it.

Use it like an HTML tag, with a capital letter so React knows it's yours and not a built-in element:

```jsx
<Footer />
```

## JSX rules that trip everyone once

- **`className`, not `class`.** `class` is a reserved word in JavaScript.
- **One root.** A component returns a single element. Wrap siblings in a `<div>`, or in an empty fragment `<>...</>` when you don't want an extra element on the page.
- **Close every tag.** `<img />`, `<input />`, `<br />`.
- **Curly braces mean "JavaScript here".** `{new Date().getFullYear()}` prints a value, and `{items.length}` prints a count.
- **Attributes are camelCase.** `tabIndex`, `htmlFor` (for `for`), `onClick`.

## Why split things up?

The same reasons as functions in JavaScript. A `Header` has one job and one file, you can read the page at a glance (`<Header />`, `<main>`, `<Footer />`), and a fix in one place fixes every page that uses it.

A good rule: if a chunk of markup has a name in your head ("the nav", "the stats card"), it's probably a component.

## How this lesson is checked

Open the `tests` folder. Each test renders a component into a pretend browser and checks what a visitor would see: roles and text, not your code. Check my work runs them and shows one line per test. You'll see this style all through the track, so it's worth reading the file once.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. Open `src/App.jsx`. It's one big function, and it uses `class`. Fix that first.
3. Move the `<header>` into `src/components/Header.jsx` and the `<footer>` into `src/components/Footer.jsx`. Show the year with `{new Date().getFullYear()}`.
4. In `App.jsx`, import both and use `<Header />` and `<Footer />`.
5. Press **Check my work**.

> Tip: the page looks identical before and after. That's the point of a refactor, and the tests are what prove it.
