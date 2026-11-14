So far you've written bits of a page. Real pages wrap everything in a standard **skeleton**. Browsers are forgiving and fill in the gaps when it's missing, but a professional page always has it.

## The skeleton

```html
<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Larkfield Private Wealth</title>
  </head>
  <body>
    <h1>Larkfield Private Wealth</h1>
  </body>
</html>
```

| Part | What it does |
|---|---|
| `<!doctype html>` | Tells the browser "this is modern HTML". Always the first line. |
| `<html lang="en-AU">` | Wraps the whole page. `lang` tells screen readers which accent to use. |
| `<head>` | Information **about** the page. Nothing in here shows on the page itself. |
| `<meta charset="utf-8">` | Lets the page show any character, from accents to emoji. |
| `<meta name="viewport" ...>` | Makes the page fit phones. Without it, phones show a tiny zoomed-out desktop page. |
| `<title>` | The words on the browser tab and the blue link in Google. |
| `<body>` | Everything visitors actually see. |

Some elements, like `meta`, have **no closing tag** because they never hold content. They're called *void* elements.

## Your turn

1. Build the skeleton around the `h1` that's already there.
2. Set `lang` to `en-AU`.
3. Add both `meta` tags and a `title` of **Larkfield Private Wealth**.
4. Keep the `h1` inside the `body`.

> Shortcut: in real VS Code, typing `!` then Tab writes this whole skeleton for you. Type it by hand today so you know what each line does.
