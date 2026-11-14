A **variable** is a labelled box that holds a value, so you can use it again and change it later.

## const and let

```js
const firmName = 'Larkfield Private Wealth';  // a box that never gets a new value
let clients = 120;                             // a box whose value can change
clients = clients + 1;                         // now it holds 121
```

Use `const` by default. Use `let` only when you know the value will change. (You'll see `var` in old code. Don't use it.)

## The basic types of value

| Type | Example | Used for |
|---|---|---|
| **string** | `'Ocean Room'` | Text, always in quotes |
| **number** | `520`, `0.14` | Amounts, counts, maths |
| **boolean** | `true`, `false` | Yes or no: is it booked? is the menu open? |

`typeof clients` tells you what type a value is.

## Template literals

Backticks (the key left of 1 on most keyboards) make a **template literal**: a string with values dropped in using `${ }`.

```js
console.log(`${firmName} looks after ${clients} families`);
```

You'll use these constantly to build text like "3 nights selected".

## Your turn

1. Make a `const` called `firmName` holding `'Larkfield Private Wealth'`.
2. Make a `let` called `clients` holding `120`, then add 1 to it on the next line.
3. Make a `const` called `isOpen` holding `true`.
4. Log this sentence using a template literal: **Larkfield Private Wealth looks after 121 families**
