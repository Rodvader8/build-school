Links are what make it a *web*. The tag is `a` (for "anchor") and the address goes in its `href` **attribute**.

## Attributes

An attribute is extra information inside the opening tag: `name="value"`.

```html
<a href="https://www.example.com">Example Company</a>
```

The words between the tags are what people click. Make them say where the link goes. "Book a first meeting" beats "click here".

## Three kinds of link

```html
<!-- 1. Another website: the full address, starting with https:// -->
<a href="https://www.moneysmart.gov.au">Moneysmart</a>

<!-- 2. A spot on the same page: # plus the id of the element -->
<a href="#fees">See our fees</a>
...
<h2 id="fees">What we charge</h2>

<!-- 3. An email: mailto: plus the address -->
<a href="mailto:hello@larkfield.example">hello@larkfield.example</a>
```

An `id` is a unique name for one element. `#fees` jumps to the element with `id="fees"`. This is how the "jump to section" menus on many sites work.

## Your turn

1. In the intro paragraph, link the word **Moneysmart** to `https://www.moneysmart.gov.au`.
2. Give the "What we charge" heading `id="fees"`.
3. Turn **See our fees** into a link that jumps to it.
4. Turn the email address at the bottom into a `mailto:` link.
5. Click your links in the preview to test them.
