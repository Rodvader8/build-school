Plenty of modern sites are styled with Tailwind. It looks odd for about ten minutes, because the markup fills up with class names. Then it clicks, and you stop switching between two files to change a margin.

This lesson is the mindset shift. You'll rebuild a small card with no CSS file at all.

## The same card, two ways

In the CSS track you'd write a class, name it, and style it somewhere else:

```css
.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #1e293b;
  background: #0f172a;
}
```

```html
<article class="card">...</article>
```

With Tailwind, each declaration already exists as a small class, and you put them straight on the element:

```html
<article class="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">...</article>
```

Same result, and nothing to name. No jumping to another file, no hunting for what `.card-inner-wrap` does, and deleting the element deletes its styles with it.

## The vocabulary is small

The names follow a pattern, so you learn the pattern rather than the list:

| Class | What it does |
|---|---|
| `p-6`, `px-5`, `mt-4` | Padding and margin (each step is 0.25rem, so `p-6` is 1.5rem) |
| `text-sm`, `text-4xl` | Font size (and a sensible line height) |
| `font-semibold` | Font weight |
| `text-slate-400`, `bg-slate-900`, `border-slate-800` | Colours from the default palette |
| `flex`, `grid`, `gap-2` | Layout |
| `rounded-2xl`, `shadow-lg` | Shape and depth |

## States are a prefix

Put `hover:` in front and the utility only applies on hover: `hover:bg-cyan-300`. You'll meet more prefixes in lesson 3.

## Tailwind only ships what you use

Tailwind scans your files for class names and writes CSS for only those. The built stylesheet stays small however big the library is. It also means class names must be written out in full: `bg-slate-900` works, but `'bg-' + colour` won't be found.

## Your turn

1. In the terminal, run `npm install`.
2. Press **Start dev server** above the preview. You'll see an unstyled card.
3. Open `index.html`. Style the `<body>`, `<main>` and `<article>`: a dark background, light text, the card centred with padding, rounded corners, a border and a gap between its lines.
4. Style the three paragraphs (a small muted label, a big number, a small green change line) and turn the link into a cyan pill with a hover colour.
5. Leave `src/style.css` alone. It's one line, and it stays one line.
6. Press **Check my work**.

> Tip: if a class does nothing, check the spelling first. Tailwind silently ignores names it doesn't know.
