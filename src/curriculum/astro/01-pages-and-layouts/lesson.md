Astro is a framework for content-led sites. It builds plain, fast HTML pages from files you write, and it ships almost no JavaScript unless you ask for it. This first lesson covers the two ideas everything else sits on: **pages** and **layouts**.

## Pages are files

Anything inside `src/pages` becomes a URL, with no routing code:

| File | URL |
|---|---|
| `src/pages/index.astro` | `/` |
| `src/pages/menu.astro` | `/menu` |
| `src/pages/about.astro` | `/about` |

An `.astro` file has two halves, split by a pair of `---` lines. The top half is JavaScript (or TypeScript) that runs **at build time**, on your machine, never in the visitor's browser. The bottom half is HTML, with `{curly braces}` to drop values in.

```astro
---
const year = new Date().getFullYear();
---
<footer>Copyright {year}</footer>
```

## The problem with copy and paste

The starter has two pages, and each one repeats the whole document: `<html>`, `<head>`, the nav and the footer. Add a third page and you'd paste it a third time. Change the nav and you'd have to remember to change it everywhere. That's how sites drift apart.

## A layout holds the shared shell

A layout is an ordinary `.astro` file (kept in `src/layouts` by habit) with a `<slot />` where each page's own content goes:

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<html lang="en-AU">
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

A page then wraps its content in the layout and passes the values in as attributes:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Menu | Saltmarsh Bakehouse" description="Country loaf, seeded rye and a Saturday-only cinnamon scroll.">
  <h1>The menu</h1>
</Base>
```

`Astro.props` is how a file reads what it was handed. The `Props` interface is TypeScript, and it means your editor warns you if a page forgets a title.

## Your turn

1. In the terminal below, run `npm install`. It installs Astro into `node_modules`.
2. Press **Start dev server** above the preview. The site appears, and it updates as you save.
3. Create `src/layouts/Base.astro`. Move the shared parts into it: the `<head>` (with `<title>{title}</title>` and a meta description), the nav, the footer, and `<slot />` inside `<main>`. Use `lang="en-AU"` on `<html>`. Keep `import '../styles/site.css';` in the layout's top half.
4. Rewrite `index.astro` and `menu.astro` to use `<Base>`. Each needs its own title and a description of 50 characters or more.
5. Create `src/pages/about.astro` with its own `<h1>`, and add an About link to the nav in the layout.
6. Press **Check my work**.

> Tip: titles do real work. They show up in browser tabs and in Google, so put the page first and the business name last: "Menu | Saltmarsh Bakehouse".
