One class gives you one declaration. A **variant** is a prefix that says *when* that declaration applies: at a certain screen width, on hover, on keyboard focus, or only if the visitor allows motion. Almost everything interactive on a Tailwind site is a utility plus a variant.

## Responsive: mobile first

```html
<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

| Prefix | Applies from |
|---|---|
| (none) | every width, so phones |
| `sm:` | 40rem (640px) |
| `md:` | 48rem (768px) |
| `lg:` | 64rem (1024px) |

Each prefix means "this width **and up**", so you build the phone layout first and add overrides as the screen grows. If you find yourself writing `max-sm:` a lot, the base layout is probably wrong.

The same ideas you learned with CSS media queries, minus the media queries.

## State variants

```html
<a class="bg-accent hover:bg-cream focus-visible:outline-2 focus-visible:outline-accent">
```

- `hover:` for the pointer. Tailwind 4 wraps it in `@media (hover: hover)`, so touch screens don't get stuck hover states.
- `focus-visible:` for keyboard focus. Every interactive element needs a visible one: it's an accessibility requirement and one of the quickest things a reviewer spots.
- `disabled:`, `aria-pressed:` and `aria-sort:` work the same way, and you'll use them later.

## Respecting reduced motion

Some people get dizzy or distracted by movement, and they tell their device so. Tailwind turns that setting into two variants:

```html
<li class="motion-safe:transition motion-safe:hover:-translate-y-1">
<span class="animate-pulse motion-reduce:animate-none">
```

Use `motion-safe:` to **add** movement only when it's welcome, and `motion-reduce:` to **take away** something that would otherwise run by default (a looping animation, say).

## Stacking

Variants combine left to right: `md:hover:bg-cream` means "on tablets and up, when hovered". You'll write some long class lists. Lesson 5 is about managing that.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. In `index.html`, make the list one column, then two from `sm`, then three from `lg`.
3. Add `md:` steps to the page padding and the heading size.
4. Give the cards a hover border, and a small lift behind `motion-safe:`.
5. Give the links a clear `focus-visible` outline. Test it: click into the preview and press Tab.
6. Stop the pulsing dot under `motion-reduce:`.
7. Press **Check my work**.

> Tip: drag the preview narrower and wider to see the columns change. Your browser's DevTools can also emulate "prefers-reduced-motion" under Rendering.
