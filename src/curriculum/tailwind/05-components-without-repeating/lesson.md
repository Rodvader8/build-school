By now you've seen the downside: a Tailwind class list can run to 100 characters, and a page with four cards has it four times. The reflex is to hide the classes in a CSS file. Usually that's the wrong fix.

## Why long class lists are fine

- They're **local**. Everything about an element is on the element, so nothing else breaks when you change it.
- They're **deletable**. Remove the element and its styling goes too. CSS files grow forever because nobody dares delete a rule.
- They're **greppable**. You can search for `rounded-2xl` and find every use.
- Repetition only hurts when it's the **same thing in many places**.

So the question isn't "how do I shorten this?". It's "is this one component that I've pasted several times?"

## Fix 1: make a component

If four cards share a class list, you have a card **component**. Write it once as a function that takes data and returns markup:

```js
export function card({ name, type, value }) {
  return `
    <article class="rounded-2xl border border-line bg-surface p-5">
      <h2 class="text-lg font-semibold">${name}</h2>
    </article>`;
}
```

Then render the data through it:

```js
cards.innerHTML = entities.map(card).join('');
```

The class list exists once, and adding a fifth card is adding a row of data. In Astro, a component file does this job, and in React, a function component does. It's the same idea in different clothes, and that's the next track.

Two cautions. Write class names out in full, because Tailwind finds them by reading your files as text (`'bg-' + colour` is invisible to it). And when you put data into HTML, **escape it**, or a name like `<img src=x>` becomes real markup.

## Fix 2: @apply, for the few cases that need it

Sometimes you can't add classes to the markup: links inside content from a CMS, or an element a third-party script creates. Then a CSS class that bundles utilities is the right tool:

```css
.btn {
  @apply inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold hover:bg-cream;
}
```

`@apply` accepts every utility and variant. Use it sparingly. A page full of `@apply` classes is just the old CSS workflow with extra steps, and you lose the benefits above.

## The decision

| Situation | Reach for |
|---|---|
| Same element, once or twice | Leave the classes in the markup |
| Same element, many times, driven by data | A component |
| Markup you can't edit | `@apply` |

## Your turn

1. Run `npm install` in the terminal, then press **Start dev server** above the preview. Four pasted cards appear.
2. In `src/components.js`, write `card()`. Include an `escapeHtml` helper, and format the value with `toLocaleString('en-AU')`.
3. In `src/main.js`, render every entity through `card` into `#cards`.
4. Delete the pasted `<article>` blocks from `index.html`. Keep the empty `#cards` section.
5. In `src/style.css`, build `.btn` with `@apply`, including hover and focus-visible states.
6. Press **Check my work**.

> Tip: the page should look the same before and after step 4. That's how you know a refactor is safe.
