If you've seen shadcn/ui, you've seen this pattern, and it's what you'll find in a lot of modern Next.js codebases. The idea: don't install a big component library. Take small, **unstyled, accessible building blocks** (Radix UI primitives), wrap each one in a file you own, and style it with Tailwind. The code lives in your repo, so you can change any of it.

## Why Radix

A dialog that works properly is surprisingly hard. It needs a focus trap, Escape to close, focus returning to the button that opened it, a locked page behind it, and the right ARIA attributes. An accordion needs arrow-key navigation and `aria-expanded`. Radix does all of that and ships no styles, so you only write how it looks.

```jsx
'use client';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

const Accordion = AccordionPrimitive.Root;
```

## The shadcn pattern

Each component file does three things:

1. Says `'use client'`, because Radix uses state and effects. This is a legitimate use of the directive.
2. Re-exports the parts it doesn't need to change.
3. Wraps the parts it does, adding classes through `cn()`.

`cn()` is the helper at the heart of the pattern:

```js
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

`clsx` joins class names (and skips `false` and `undefined`). `twMerge` then resolves clashes, so `cn('px-2', 'px-4')` is `px-4`. That's what lets a caller override a default: `<Button className="px-10">`.

## Data attributes for state

Radix marks state on the element: `data-state="open"`. Tailwind can style it directly, with no extra JavaScript:

```jsx
className="[&[data-state=open]>span]:rotate-45"
```

## Server pages, client parts

Your pages stay server components. They import the client wrappers and compose them. A server page can pass plain elements as `children` to a client component, so only the interactive pieces ship JavaScript.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The home page has a button that does nothing yet. Open `/faq` to see the accordion working.
2. Open `tests/ui.test.jsx`.
3. Fix `cn` in `lib/utils.js` using `clsx` and `twMerge`.
4. Read `components/ui/accordion.jsx`, then fill in `components/ui/dialog.jsx` (the file is open and waiting) in the same style: `Dialog`, `DialogTrigger`, `DialogClose`, `DialogContent` (portal, overlay, content, a close button), `DialogTitle` and `DialogDescription`.
5. In `app/page.jsx`, wrap the button in a dialog that explains how to pre-order.
6. Press **Check my work**. The tests drive the components with a real keyboard and pointer, the way a person would.

> Tip: always give a dialog a `DialogTitle`. It's what a screen reader announces when the dialog opens, and Radix will warn in the console if it's missing.
