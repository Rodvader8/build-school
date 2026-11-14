Generics sound like the scary end of TypeScript, and mostly they aren't. A generic is a function (or type) with a **placeholder** in it, so one definition works for numbers, strings and your own shapes while still remembering which one it was given. You've already used them: `Record<Region, number>` and `querySelector<HTMLInputElement>` both take type arguments.

## The problem generics solve

```ts
function firstOf(items: any[]): any {
  return items[0];
}
const price = firstOf([4.5, 6]); // any
price.toUpperCase();             // no error, and a crash at runtime
```

`any` switches the checker off for everything it touches. You want "whatever type goes in a list, that type comes out".

## A type parameter

```ts
function firstOf<T>(items: T[]): T | undefined {
  return items[0];
}

const a = firstOf([4.5, 6]);      // number | undefined
const b = firstOf(['a', 'b']);    // string | undefined
```

`<T>` declares a placeholder. TypeScript works out what `T` is from the arguments, so you rarely have to write it out yourself.

## Constraints

A placeholder can be limited with `extends`:

```ts
function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K) { /* ... */ }
```

`K extends string` means the key can be any string type (including exact ones like `'a' | 'b'`), but not a number. Two placeholders, `T` and `K`, are written in one pair of angle brackets and separated by a comma.

## Generic types

Types take parameters too. This one comes up constantly:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

A function that might fail returns a `Result<number>` instead of throwing. The caller checks `result.ok`, and inside that `if` TypeScript knows whether `value` or `error` exists.

## When not to bother

If a function only ever handles one type, don't make it generic. Reach for a placeholder when you notice the same logic repeated for different types, or when the output type depends on the input type. Light touch is the aim.

## Testing types

**Check my work** doesn't only run your functions. It also writes a tiny throwaway file with lines like `// @ts-expect-error` above a deliberately wrong call, and asks tsc about it. If your function still says `any`, that wrong call isn't an error any more, and the check fails. That's a type-level test.

## Your turn

1. Run `npm install` in the terminal below, then press **Run**.
2. Make `firstOf` generic.
3. Make `groupBy` generic in `T` and `K`.
4. Write `parsePrice` (strip `$`, commas and spaces, then use `Number`) and make `mapResult` generic in `T` and `U`.
5. Run `npx tsc --noEmit` until it's clean, then press **Check my work**.

> Tip: after a few of these, hover over a call like `groupBy(...)` in the editor. Seeing the placeholders filled in is the fastest way to get comfortable with generics.
