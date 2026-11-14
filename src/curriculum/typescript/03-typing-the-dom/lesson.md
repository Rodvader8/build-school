The DOM is where TypeScript earns its keep on a website. `document.querySelector('.price')` might find nothing. Even when it finds something, it's only an `Element`, which doesn't have a `.value` or an `.innerText`. JavaScript lets you find that out in front of a customer. TypeScript tells you at your desk.

## The DOM types

This project's `tsconfig.json` lists `"lib": ["ES2022", "DOM"]`. The `DOM` part is what teaches tsc about `document`, `HTMLElement`, `MouseEvent` and the rest. They form a family tree, general to specific:

- `EventTarget`: anything that can receive events
- `Element`: any tag
- `HTMLElement`: any HTML tag (has `innerText`, `dataset`, `hidden`)
- `HTMLInputElement`: an `<input>` (has `.value`, `.checked`)

## Null is the first problem

```ts
const input = document.querySelector('#qty'); // Element | null
input.value;                                  // two errors
```

Fix it in two steps. Say what you expect to find, and check that you found it:

```ts
const input = document.querySelector<HTMLInputElement>('#qty');
if (!input) return;
input.value; // fine: tsc knows it's an input, and not null
```

The angle brackets are a **type argument**. You'll meet them again in lesson 5.

## Narrowing event targets

`e.target` is only an `EventTarget | null`. Use `instanceof` to prove what it is:

```ts
if (!(e.target instanceof HTMLElement)) return;
e.target.dataset.step; // fine now
```

You'll see `e.target as HTMLElement` all over the internet. It works, but it's you telling tsc to stop checking. The `instanceof` check actually proves it, and it keeps working when somebody clicks an SVG.

## Testing DOM code without a browser

Node has no `document` and no `HTMLElement`, so the code in this lesson is written as plain functions that take elements as arguments. That's a good habit anyway. **Check my work** passes them stand-in objects and fakes a bare `HTMLElement` class, so `instanceof` has something to test against. Your page wiring at the bottom of `main.ts` is wrapped in `if (typeof document !== 'undefined')` so it's skipped in Node.

## Your turn

1. Run `npm install` in the terminal below.
2. Press **Run**. Nothing prints, and that's fine: it only defines functions.
3. Run `npx tsc --noEmit`. It's clean, because four comments are hiding the errors.
4. Delete one `// @ts-expect-error` line at a time. Read the error and fix the code behind it: the null check, `HTMLElement` instead of `Element`, the `instanceof` narrowing and the `<HTMLInputElement>` type argument.
5. Press **Check my work**.

> Tip: hover over a variable in the editor. Monaco shows the type TypeScript has worked out, which is the quickest way to understand a narrowing.
