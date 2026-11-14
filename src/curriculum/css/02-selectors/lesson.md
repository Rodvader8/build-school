A selector decides which elements a rule touches. Pick the right one and you can style anything on the page without touching the HTML.

## The selectors you'll use most

```css
p { }                 /* element: every p */
.nm-lede { }          /* class: anything with class="nm-lede" */
.nm-nav a { }         /* descendant: any a inside .nm-nav */
.nm-nav a:hover { }   /* pseudo-class: an a while the mouse is over it */
```

**Classes are the workhorse.** Every class on this page starts with `nm-` for Larkfield. That prefix stops one site's styles leaking into another, which is a common way for several sites to share one codebase without clashing.

## The cascade

When two rules set the same property on the same element, CSS picks a winner:

1. **More specific wins.** A class beats an element. So `.nm-lede` beats `p`, even though the intro paragraph is a `p`.
2. **If it's a tie, the later rule wins.**

That's the "cascading" in Cascading Style Sheets.

## Keyboard users matter

`:focus-visible` styles an element when someone reaches it with the Tab key. Never remove focus outlines without giving a better one. Keyboard and switch users rely on them.

## Your turn

1. Make every `p` muted: `color: #b8b2a4`.
2. Make `.nm-lede` stand out: `color: #e8e4da` and `font-size: 1.25rem`. Watch it beat the `p` rule.
3. Style the menu links, `.nm-nav a`: `color: #e8e4da` and `text-decoration: none` (no underline).
4. On hover, `.nm-nav a:hover`, turn them gold: `#f2c38b`.
5. Give `.nm-nav a:focus-visible` an `outline` of `2px solid #f2c38b` and an `outline-offset` of `4px`.

Test it: click inside the preview, then press Tab to move through the links.
