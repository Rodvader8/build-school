An **event** is something that happens: a click, a key press, the pointer moving, the page scrolling. You tell an element what to do when it happens with `addEventListener`.

```js
button.addEventListener('click', () => {
  console.log('clicked');
});
```

The arrow function is the **handler**. It runs every time the event fires.

## A menu toggle, done properly

```js
button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
});
```

- The CSS already shows `.db-menu` only when it has `is-open`. JavaScript just flips the class.
- `aria-expanded` tells screen readers whether the menu is open. Every well-built mobile menu does this.

## Keys

```js
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { /* close it */ }
});
```

The handler receives an **event object** with details: which key, where the pointer was, and so on.

## The cursor lens

Larkfield's hero has a glowing lens that follows the pointer. The trick is to write the pointer's position into CSS custom properties, and let CSS draw the glow:

```js
lens.addEventListener('pointermove', (event) => {
  const box = lens.getBoundingClientRect();   // where the panel is on screen
  lens.style.setProperty('--mx', `${event.clientX - box.left}px`);
  lens.style.setProperty('--my', `${event.clientY - box.top}px`);
});
```

`clientX` is the pointer's position in the window. Subtracting the panel's left edge gives the position *inside* the panel. Setting custom properties from JavaScript is the one accepted kind of inline style: your stylesheet still does all the styling.

## Your turn

1. Make the Menu button open and close the menu, keeping `aria-expanded` in step (`"true"` or `"false"`).
2. Make the Escape key close the menu.
3. Make the lens follow the pointer by setting `--mx` and `--my` in px, rounded with `Math.round`.
