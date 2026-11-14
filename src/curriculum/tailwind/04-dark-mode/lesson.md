Dark mode sounds like a styling job, and it's actually a **state** job. Someone has to decide which theme is on, remember it, and apply it before the page paints. The styling is the easy part.

## What Tailwind does by default

Out of the box, `dark:bg-slate-950` follows the visitor's operating system setting (`prefers-color-scheme`). That's fine until you want a button, and you almost always want a button. Then you need to be in control.

## The class strategy

In Tailwind 4 you redefine what `dark:` means, in CSS:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

Now `dark:` applies whenever the element, or any ancestor, has the class `dark`. Put that class on `<html>` and the whole page switches:

```html
<body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
```

Read it as "white by default, near black when dark". The `:where()` keeps the specificity at zero, so `dark:` utilities never fight with other utilities.

## Three jobs, three places

| Job | Where | How |
|---|---|---|
| Apply the colours | CSS | `dark:` utilities and the `@custom-variant` line |
| Flip the class | `src/theme.js` | `classList.toggle('dark', dark)` on `<html>` |
| Remember it | `localStorage` | Save `'dark'` or `'light'`, always in try/catch |

That last row is the "state, then render" pattern from the JavaScript track: the state is whether the `dark` class is present, and the render is Tailwind reading it.

## No flash

If the class is only added when your module script runs, a dark-mode visitor sees a white page for a moment first. To stop that, put a tiny **inline** script in `<head>`. It runs before anything is painted:

```html
<script>
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
  } catch {}
</script>
```

It's the one place an inline script is the right call. It also falls back to the system setting the first time, when nothing is saved yet.

## Accessibility

The toggle is a `<button>` with `aria-pressed`, so screen readers announce "Dark mode, toggle button, pressed". Don't change the label when you flip it, or the announcement gets confusing.

## Your turn

1. Run `npm install` in the terminal, then press **Start dev server** above the preview.
2. In `src/style.css`, add the `@custom-variant dark` line.
3. In `index.html`, pair the light colours with `dark:` twins for the background, text, borders and the card.
4. Write the click handler in `src/theme.js`: toggle the class, update `aria-pressed`, and save the choice.
5. Add the inline script to `<head>` that applies the saved theme (or the system setting) before paint.
6. Press **Check my work**.

> Tip: test it for real. Switch the theme, then press F5. It should stay put, with no white flash.
