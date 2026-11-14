Here's what makes a phone app feel like a phone app: it can reach into the device. The camera, location, notifications, haptics, the clipboard. In Expo each one is a small package (`expo-camera`, `expo-haptics`...) with a JavaScript API. You install it, import it and call it.

This lesson uses the safest and most useful one to learn the pattern with: **the clipboard** (`expo-clipboard`). A hotel owner has a lockbox code for late arrivals, and wants one tap to copy it into a message.

## Installing a device package

```
npx expo install expo-clipboard
```

Use `npx expo install`, not plain `npm install`. It picks the version that matches your Expo, the same matched-set rule from lesson 1. (Here it's already in `package.json`.)

## Calling it

```js
import * as Clipboard from 'expo-clipboard';

await Clipboard.setStringAsync('4821');
```

Almost every device call is **asynchronous**, so you `await` it. And almost every one **can say no**: the user may have denied a permission, the device may not have the hardware, or on the web the browser may block it (the clipboard only works on secure pages). Code that assumes success crashes on the day it matters.

## The fallback pattern

Three habits make a device feature safe:

1. **Wrap the call and never throw.** Put it in one function that returns a plain result, `{ ok: true }` or `{ ok: false, reason }`.
2. **Keep the Expo call in one file.** Only `lib/copy.js` imports `expo-clipboard`. Screens call `copyText` and don't care how it's done, so changing or faking it later means editing one place. (The tests do exactly that: they swap in a stand-in clipboard that can succeed or fail on command.)
3. **Always have a plan B the user can see.** If the button can't copy, say so, and leave the code on screen with `selectable` so they can press and hold to copy it by hand. On the web that's the equivalent of selecting text.

The same shape works for any feature. Haptics, for instance, quietly do nothing on a laptop, and you'd guard them with `Platform.OS !== 'web'`.

## Telling people what happened

A "Copied" message that only appears on screen is invisible to a screen-reader user. Give the message `role="status"` and it's announced when it appears, without stealing focus.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The button does nothing yet.
2. Open `tests/clipboard.test.jsx`. It makes the clipboard succeed, refuse and throw.
3. In `lib/copy.js`, make `copyText` never throw: `try`/`catch` around the call, and `{ ok: false, reason: 'blocked' }` when it resolves to `false`.
4. In `components/DoorCodeCard.jsx`, wire up `onPress`, show the "Copied" and failure messages with `role="status"`, and make the code `selectable`.
5. Press **Check my work**, then press the button in the preview and paste somewhere to see what you copied.
