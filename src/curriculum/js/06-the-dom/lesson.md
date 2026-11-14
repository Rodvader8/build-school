The **DOM** (Document Object Model) is the browser's live version of your HTML. JavaScript can read it and change it, and the page updates instantly. This is how dashboards turn data into tables.

## Finding elements

```js
const body = document.querySelector('.db-fees');      // the first match, using a CSS selector
const rows = document.querySelectorAll('tbody tr');   // every match
```

Same selectors you learned in CSS.

## Changing them

```js
heading.textContent = '4 plans';     // replace the text
card.classList.add('is-active');     // add a class (CSS does the styling)
```

## Making new ones

```js
const row = document.createElement('tr');
const cell = document.createElement('td');
cell.textContent = 'Essentials';
row.append(cell);
body.append(row);
```

**Why `textContent` and not `innerHTML`?** `innerHTML` treats text as HTML. If a client's name or a form entry ever contains `<script>`, it runs. That's a real attack called XSS. `textContent` is always just text. Pros reach for it first.

## Your turn

The starter has the plans and a `formatFee` function.

1. Find the empty `tbody` with the class `db-fees`.
2. Loop over `plans`. For each plan, create a `tr` with three `td` cells: the name, who it suits, and the formatted fee.
3. Change the `.db-count` paragraph to say **4 plans**, using `plans.length`.
4. Use `textContent` throughout. No `innerHTML`.
