A phone app is rarely one screen. People tap a room, see its details, and press back. **expo-router** handles that with an idea you already know from Next.js: the file system is the route table. A file in the `app/` folder is a screen, and its path is its address.

## Files are routes

```
app/
  _layout.jsx      wraps every screen (the header, the navigator)
  index.jsx        the screen at "/"
  rooms/
    [id].jsx       the screen at "/rooms/anything"
```

`[id].jsx` has square brackets, which makes it a **parameter**: `/rooms/loft` and `/rooms/garden` both open it, with `id` set to `loft` or `garden`. Same convention as Next.js, and it works the same way on the web, iOS and Android, because Expo gives each screen a URL.

## The layout and the Stack

`_layout.jsx` doesn't show anything itself. It wraps the screens, and its job is to say how they move. A **Stack** slides each new screen over the last one, and gives you a header with a back button for free:

```jsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Hotel Marlow' }} />
      <Stack.Screen name="rooms/[id]" options={{ title: 'Room details' }} />
    </Stack>
  );
}
```

The `name` is the file path without the extension. Other layouts exist too (`Tabs` gives you a tab bar), and you can nest them. You'll use the Stack here.

## Moving between screens

```jsx
import { Link, useLocalSearchParams } from 'expo-router';

<Link href="/rooms/loft">The Loft</Link>

// in app/rooms/[id].jsx
const { id } = useLocalSearchParams();
```

Don't trust the address. Someone can type `/rooms/penthouse`, or follow a stale link, so a screen that looks something up must handle "not found" as an ordinary case and say so, never crash. The same screen can also set its own header from inside: `<Stack.Screen options={{ title: room.name }} />`.

## How this is tested without a phone

Real navigation needs a navigator, so the tests swap `expo-router` for a small stand-in (see `tests/stubs/expo-router.jsx`). Links become plain anchors, and a test sets the route's parameters by hand. The export step still runs the real router over your files, so a missing or misnamed screen shows up there.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. You'll see a plain list.
2. Open `tests/navigation.test.jsx`.
3. In `app/index.jsx`, turn each room name into a `Link` to `/rooms/<id>`.
4. Build `app/rooms/[id].jsx` as its comments describe: read the id, find the room, handle "not found", and set the header title.
5. In `app/_layout.jsx`, replace `Slot` with a `Stack` and two titled screens.
6. Press **Check my work**, then click through the rooms in the preview.

> Tip: the preview is a web page, so the browser's own back button works too. On a phone it's the header's arrow or a swipe from the left edge.
