Real projects are many files. **Modules** let each file share exactly what it chooses and nothing else. Most modern site scripts, and every React and Next.js app you'll build, is made of modules.

## export and import

In the file that has something to share:

```js
export const rooms = [ ... ];
export function formatRate(amount) { ... }
```

In the file that needs it:

```js
import { rooms, formatRate } from './data.js';
```

The `./` means "in the same folder". The names in the curly braces must match the exports.

## Loading a module

Modules need one extra word on the script tag:

```html
<script type="module" src="main.js"></script>
```

Three things change with `type="module"`:

1. `import` and `export` work.
2. Each file has its **own scope**. A `const` in `data.js` isn't visible anywhere else unless you export it, so two files can't clash by accident.
3. The script waits for the HTML to finish loading before it runs, wherever the tag sits.

## Your turn

Right now the page shows nothing, and the Terminal shows an error: `main.js` uses `rooms`, but `rooms` lives in a different file.

1. In **data.js**, export `rooms` and `formatRate`.
2. In **main.js**, import them at the top.
3. In **index.html**, add `type="module"` to the script tag.
4. The list should show all three rooms, like **Garden Room, $380 a night**.
