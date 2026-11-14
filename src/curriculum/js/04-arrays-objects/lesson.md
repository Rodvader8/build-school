Real data comes in lists of things, and each thing has details. JavaScript has a shape for each: **arrays** for lists and **objects** for things.

## Objects: one thing, many details

```js
const plan = { name: 'Essentials', suits: 'One clear goal', fee: 4400 };

plan.name   // 'Essentials'
plan.fee    // 4400
```

Each `key: value` pair is a **property**. You read one with a dot.

## Arrays: an ordered list

```js
const rooms = ['Garden Room', 'Ocean Room', 'Cliff Suite'];

rooms[0]       // 'Garden Room'  (counting starts at 0)
rooms.length   // 3
rooms.push('Loft');   // adds to the end
```

## Arrays of objects

This is the shape of nearly all dashboard data: a list of rows, each an object.

```js
const plans = [
  { name: 'Essentials', fee: 4400 },
  { name: 'Family', fee: 7700 },
];
```

Two array methods you'll use daily:

```js
plans.map((plan) => plan.name);              // ['Essentials', 'Family']: transform every item
plans.find((plan) => plan.name === 'Family'); // the first item that matches
```

`===` means "is exactly equal to".

## Your turn

1. Finish the `plans` array with **Family** (Couples and growing families, 7700) and **Private** (Complex, multi-entity wealth, 13200).
2. `push` a fourth plan: **Foundation**, suits "Just starting out", fee 2200.
3. Make `planNames` with `map`: `['Essentials', 'Family', 'Private', 'Foundation']`.
4. Make `family` with `find`, then log `family.fee`.
