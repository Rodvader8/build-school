Every site you've built so far is JavaScript, and JavaScript is happy to let you add a string to a number and find out at 2am. **TypeScript** is JavaScript plus labels. You describe what each value is, and a checker called `tsc` tells you about mistakes before anything runs. Plenty of production data files and scroll scripts are TypeScript for this reason.

## The honest bit about running it

Node 24 can run a `.ts` file directly: `node main.ts`. It does that by **stripping** the types out, leaving plain JavaScript. It never checks them. So there are two separate jobs:

- `node main.ts` runs the code (types ignored).
- `npx tsc --noEmit` checks the types (nothing is written to disk).

Stripping only works for syntax that can simply be erased, like `: number`. Things that need real generated code, such as `enum`, don't work. You'll hit that in lesson 2.

## Inference: you write less than you'd think

```ts
const gstRate = 0.1;          // TypeScript works out: number
const prices = [4.5, 6, 12];  // number[]
```

You only add a type where TypeScript can't work it out, mostly function parameters and return types:

```ts
function withGst(price: number): number {
  return price * (1 + gstRate);
}
```

## Unions and literals

A value can be one of several types, or one of several exact strings:

```ts
type Size = 'small' | 'large';
function toQuantity(raw: string | number) { /* ... */ }
```

Inside the function you **narrow** it: `if (typeof raw === 'number') return raw;` and after that line TypeScript knows `raw` is a string.

## undefined is a real possibility

`list[0]` on an empty array is `undefined`. This project's `tsconfig.json` turns on `noUncheckedIndexedAccess`, so tsc makes you handle that. Say so in the type (`number | undefined`) and check before you use the value.

## Silenced mistakes

The starter has four lines marked `// @ts-expect-error`. That comment tells tsc "I know the next line is wrong, stay quiet." It's real and useful (for tests, mostly), but here somebody used it to hide genuine bugs.

## Your turn

1. In the terminal below, run `npm install`. This fetches TypeScript into `node_modules`.
2. Press **Run**. It works, because Node ignores types.
3. Run `npx tsc --noEmit` in the terminal. It reports an error in `firstPriceLabel`. Fix it.
4. One at a time, delete each `// @ts-expect-error` line and run tsc again. Read the message, then fix the real problem: the text `'12'`, the missing `'medium'` size (it costs 6.5), the `cheapest` return type, and the `toQuantity` narrowing.
5. Press **Check my work**.

> Tip: Monaco, the editor in this app, underlines type errors in red as you type, just like VS Code. Hover over one to read it.
