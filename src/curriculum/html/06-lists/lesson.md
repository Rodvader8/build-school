Lists are everywhere on real sites: menus, service lists, steps, feature ticks. There are two kinds.

```html
<!-- Unordered: the order doesn't matter. Shows bullets. -->
<ul>
  <li>Retirement planning</li>
  <li>Investment advice</li>
</ul>

<!-- Ordered: the order matters. Shows numbers. -->
<ol>
  <li>First meeting</li>
  <li>Your plan</li>
</ol>
```

`li` means "list item". Every `li` lives inside a `ul` or an `ol`, never on its own.

Later, CSS will remove the bullets and turn a plain `ul` of links into a sleek navigation bar. That's what nearly every site menu is underneath.

## Your turn

1. Turn the services into a `ul` with one `li` per service (there are four).
2. Turn the four steps of "How a first year runs" into an `ol`, because their order matters.
3. Delete the `-` and the typed numbers. The list adds its own.
