On a real dashboard the data module is the part you edit most: next month's numbers, a new region, a renamed product. It's also where one typo quietly breaks a chart. Typing the data file means the editor catches those typos the moment you make them. It's the same trick behind the `src/data/*.ts` files in many real projects.

## Build types from one source

Write the list of allowed values once, and derive the type from it:

```ts
export const REGIONS = ['north', 'south', 'west'] as const;
export type Region = (typeof REGIONS)[number]; // 'north' | 'south' | 'west'
```

Now you can loop over `REGIONS` at runtime, and `Region` is always in step with it. Add a region in one place and every type that mentions it updates.

## Type the rows

```ts
interface SalesRow { month: string; region: Region; revenue: number; orders: number }
const sales: SalesRow[] = [ { month: 'Jan', region: 'north', revenue: 4200, orders: 310 } ];
```

A misspelt region, a number written as `'3350'` or a missing field now shows up as a red underline in the row itself.

## Record: one value per key

```ts
const targets: Record<Region, number> = { north: 4500, south: 3300, west: 3000 };
```

`Record<Region, number>` means every region must be present, no more and no fewer. Forget one and tsc tells you which.

## satisfies: check the shape, keep the detail

Annotating a value (`const palette: Record<Region, string> = ...`) checks it but widens every value to plain `string`. `satisfies` checks the shape and leaves the exact values alone:

```ts
const palette = {
  north: '#1b7f79',
  south: '#c8501c',
  west: '#3a5bd0',
} satisfies Record<Region, string>;
```

Miss a region and it's an error. Hover `palette.north` and you still get `'#1b7f79'`, not just `string`.

## Return the narrow type

A function that says it returns `string` when it really returns one of three strings throws away information. Declare `: Region` and the caller can use the answer to index `targets` or `palette` with no casts.

## Your turn

1. Run `npm install` in the terminal below, then press **Run**.
2. Delete the first `// @ts-expect-error` line, and fix the typo in that row. Do the same for the second row, then for `targets`.
3. Add `satisfies Record<Region, string>` to `palette`.
4. Write `totalsByRegion` and tighten `topRegion` so it takes a `Record<Region, number>` and returns a `Region`.
5. Press **Check my work**. Some of its checks write a tiny throwaway file and ask tsc about it, to test your types as well as your values.

> Tip: if `tsc` complains about a message you don't understand, read it from the bottom. The last line is usually the specific thing that doesn't match.
