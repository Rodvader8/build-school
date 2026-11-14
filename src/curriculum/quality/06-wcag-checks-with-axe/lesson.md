About one in five Australians lives with a disability, and plenty more are using a phone in sunlight, one-handed, or with a broken trackpad. Accessibility means those people can use your page. It's also law in many places, and it overlaps heavily with SEO and good UX, so the fixes pay for themselves.

The standard is **WCAG** (the Web Content Accessibility Guidelines). Most sites aim for level **AA**. Four ideas cover the ground you'll meet most:

1. **Contrast.** Normal text needs a contrast ratio of at least 4.5 to 1 against its background. Pale grey on white looks elegant and fails.
2. **Names.** Everything interactive needs a name a screen reader can read out: alt text on images, a `<label>` on every field, and text or an `aria-label` on icon-only buttons and links.
3. **Structure.** Real landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), one `<h1>` and headings that go down one level at a time. People using screen readers jump around by landmark and heading, like skimming a menu.
4. **Keyboard.** Everything must work with Tab, Shift+Tab, Enter and Space, in an order that makes sense, with a **visible focus indicator** so you can tell where you are.

## Naming things

```html
<img src="garden.svg" alt="A native garden with a curved stone path" />

<label for="email">Email</label>
<input id="email" type="email" />

<button type="button" aria-label="Close notice">
  <svg aria-hidden="true">...</svg>
</button>
```

A placeholder is not a label: it vanishes when you start typing and many screen readers skip it. `aria-hidden="true"` on the icon stops it being read as well as the name. If an image is purely decoration, use `alt=""` so it's skipped.

## Keyboard order and the skip link

Tab follows the order of the HTML, so write the HTML in the order people should read it. Don't use a positive `tabindex` such as `tabindex="3"`: it yanks an element to the front of the queue and wrecks the order. Use `tabindex="0"` or nothing.

The first Tab stop on a page should be a **skip link**, so keyboard users can jump past the navigation:

```html
<a class="skip" href="#main">Skip to content</a>
...
<main id="main">
```

You can hide it off-screen, but it must appear when it receives focus.

## axe-core

**axe-core** is the engine behind most accessibility checkers (it's what powers the tools in browser dev tools). You hand it a rendered page and it returns every rule that failed, with the HTML that caused it. It catches roughly a third to half of real problems, which is why this lesson adds keyboard checks too. It can't tell you whether your alt text is *good*, only that it exists.

## Your turn

Check my work opens your page in a real browser, runs axe-core, then presses Tab through the page and watches where focus goes.

1. Start the dev server and open the page. Try using it with only the keyboard.
2. Press **Check my work** and read what axe reports.
3. Fix `site/index.html` and `site/style.css` until every check passes: language, landmarks, contrast, alt text, labels, button and link names, heading order, the skip link, tab order and the focus ring.
4. The last check runs all of axe's WCAG rules together, so it's the final proof.
