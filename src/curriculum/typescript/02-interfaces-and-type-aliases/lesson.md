Most of what you'll type in TypeScript is describing the shape of data: a booking, an order, a row on a dashboard. Two tools do that job, and the difference is smaller than the internet makes out.

## interface: the shape of an object

```ts
interface Booking {
  id: number;
  name: string;
  guests: number;
  note?: string;   // the ? makes it optional
}
```

An interface can be extended, which is handy when one thing is a special case of another:

```ts
interface VipBooking extends Booking {
  table: string;
}
```

## type: a name for any type

A `type` alias can name an object shape too, but it can also name things an interface can't, like unions:

```ts
type Summary = { total: number; guests: number };
type Status = 'pending' | 'confirmed' | 'cancelled';
```

A fair rule of thumb: `interface` for object shapes you'll extend, `type` for everything else. Either is fine, as long as the project picks one habit and sticks to it.

## Enums don't run in Node

Plenty of tutorials use `enum Status { Pending, Confirmed }`. It looks tidy, but an enum isn't just a label. It creates a real object at runtime, so something has to generate JavaScript for it. Node's type stripping only deletes types, so it refuses:

```
TypeScript enum is not supported in strip-only mode
```

The same goes for `namespace` and for constructor parameter properties (`constructor(private id: number)`). This project's `tsconfig.json` has `erasableSyntaxOnly` switched on, so `tsc` warns you about these too.

The replacement is one list and one derived type:

```ts
const STATUSES = ['pending', 'confirmed', 'cancelled'] as const;
type Status = (typeof STATUSES)[number];
```

`as const` freezes the list to exact strings. `typeof STATUSES` reads its type, and `[number]` means "any item of it". You get a runtime array to loop over and a union type from the same source.

## Records and narrowing

`Record<Status, number>` means an object with a number for every status, and tsc complains if you forget one. When a value could be two shapes, `'table' in b` checks for a property, and inside that branch TypeScript knows you have a `VipBooking`.

## Your turn

1. Run `npm install` in the terminal below.
2. Press **Run**. It crashes on the enum. Read the error.
3. Replace the enum with `STATUSES` and `type Status`, and update `sample` to use plain strings.
4. Add the optional `note`, the `VipBooking` interface and the `Summary` type.
5. Write `summarise` and `describe` (the comments in the file say what each should do).
6. Press **Check my work**.

> Tip: if tsc says a `Record` is missing a key, that's the point. It stops you adding a fourth status and forgetting to handle it.
