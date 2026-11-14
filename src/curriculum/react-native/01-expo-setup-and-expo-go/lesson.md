You already know React. React Native is the same idea (components, props, state, hooks) pointed at a different target: instead of building web pages, your components become real buttons, lists and text on a phone. **Expo** is the toolkit that makes it painless. It handles the build tooling, gives you ready-made device features, and lets you see your app without installing Xcode or Android Studio.

## What's different from the web

There's no HTML. You don't write `<div>` or `<p>`. You write the building blocks React Native gives you, and they're all imported from one place:

```jsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Hello from a phone</Text>
    </View>
  );
}
```

`View` is the box (think `div`). `Text` is the only thing that can hold words: a bare string outside `Text` is an error on a phone. There's no CSS file either, which is the next lessons' topic.

## Running it without a phone

On a phone, Expo's tooling bundles your JavaScript and the Expo Go app runs it. In this course there's a shortcut: Expo can also target the **web**, using a library called react-native-web that turns `View` and `Text` into ordinary page elements. Your code doesn't change. So the preview here shows your app in a phone-sized column, and the tests render it the same way. It's a very good approximation, and it's all this course needs.

## The files that matter

- `App.jsx` is your root component.
- `index.js` hands it to Expo with `registerRootComponent(App)`.
- `app.json` holds the app's name, slug and settings.
- `package.json` pins `expo`, `react` and `react-native` to exact versions, because they only work as a matched set. Never bump one on its own. (`npx expo install <package>` picks the version that fits your Expo.)

> **Optional extra: a real phone.** Install **Expo Go** from your phone's app store, make sure the phone and laptop are on the same Wi-Fi, run `npx expo start` in the terminal and scan the QR code it prints. Your app opens on the phone and updates as you save. You can skip this entirely and still finish the course.

## Your turn

1. In the terminal, run `npm install`. It takes a minute.
2. Press **Start dev server** above the preview. The first load is slow while Expo bundles everything. You'll see "Hello, world".
3. Open `App.jsx`. Replace the greeting with a heading (`<Text role="heading" aria-level={1}>`) that says **Hotel Marlow**, and a tagline `Text` with `testID="tagline"` underneath, with one friendly sentence about the hotel. Use the `title` and `tagline` styles that are already at the bottom of the file.
4. Open `app.json`. Set `name` to `Hotel Marlow` and `slug` to `hotel-marlow`.
5. Press **Check my work**.

Leave the dev server running while you edit. Saving a file refreshes the preview on its own.
