Almost every site has the same bones: a header with a menu, the main content in sections, and a footer. HTML has a tag for each of those jobs.

```html
<header>
  <nav>
    <ul>
      <li><a href="#approach">Approach</a></li>
      <li><a href="#fees">Fees</a></li>
    </ul>
  </nav>
</header>

<main>
  <h1>Larkfield Private Wealth</h1>
  <section id="approach">
    <h2>Our approach</h2>
    ...
  </section>
</main>

<footer>
  <p>Larkfield Private Wealth. AFSL 000000.</p>
</footer>
```

| Tag | Job |
|---|---|
| `header` | The strip at the top: logo and menu. |
| `nav` | A block of main navigation links. |
| `main` | The page's unique content. Only one per page. |
| `section` | A themed chunk of the page, normally with its own `h2`. |
| `footer` | The bottom strip: contact, legal, small print. |

These are called **semantic** tags. They look like nothing on their own, but they tell browsers, screen readers and search engines what each part is. A page built from them is easier to style, easier to navigate with a keyboard and easier for Google to read.

## Your turn

The content is all there. Give it its structure:

1. Wrap the menu list in a `nav`, inside a `header`.
2. Wrap the h1 and both sections' content in `main`.
3. Wrap each h2 and its paragraph in a `section`, with `id="approach"` and `id="fees"` so the menu links work.
4. Wrap the last line in a `footer`.
