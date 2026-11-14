In the HTML track you built the Larkfield page's structure. CSS (Cascading Style Sheets) is how it gets its look: colour, type, spacing, layout and motion. Every site you visit is this same idea, pushed a long way.

## Linking a stylesheet

CSS lives in its own file, linked from the page's `head`:

```html
<link rel="stylesheet" href="style.css">
```

One stylesheet can style every page on a site. Change it once and the whole site changes.

## A rule

```css
body {
  background-color: #0c1220;
  color: #e8e4da;
}
```

| Part | Name | Meaning |
|---|---|---|
| `body` | **selector** | Which elements this rule styles. |
| `background-color` | **property** | What you're changing. |
| `#0c1220` | **value** | What you're changing it to. |

Each `property: value;` pair is a **declaration** and ends with a semicolon. The curly braces hold them all.

Colours like `#0c1220` are **hex codes**: two digits each for red, green and blue, from `00` to `ff`. `#0c1220` is a very dark navy, the Larkfield night sky.

## Your turn

The editor has two tabs. You'll need both.

1. In **index.html**, add the `link` tag inside the `head`, just before `</head>`.
2. In **style.css**, give `body` a `background-color` of `#0c1220` and a `color` of `#e8e4da`.
3. Give `body` a `font-family` of `system-ui, sans-serif` (your computer's own interface font, with a fallback).
4. Make the `h1` gold: `color: #f2c38b`.

> The big headland image spills off the side for now. You'll tame it in lesson 3.
