On the web you write CSS in a stylesheet. In React Native there's no CSS at all. Styles are **JavaScript objects**, and that's by design, not a shortcut. A phone has no browser and no cascade to resolve, so each component's look is just data you hand it, and nothing outside it can change it by accident.

(It's also why this is *not* the same as an inline `style` on the web. The objects aren't turned into attributes on an element. They're passed to a native view, and `StyleSheet.create` lets React Native register them once and reuse them. That's why the habit here is to define them in one named block, not scatter them through the JSX.)

## StyleSheet.create

```jsx
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  name: { fontSize: 20, fontWeight: '700' },
});

<View style={styles.card}>
  <Text style={styles.name}>Garden Room</Text>
</View>
```

The rules differ from CSS in a few ways worth memorising:

- **camelCase names**: `marginTop`, `backgroundColor`, never `margin-top`.
- **Numbers are density-independent pixels**: `padding: 16` has the same physical size on any phone. Percentages are strings: `width: '100%'`.
- **No cascade.** A `Text` doesn't inherit its parent's colour or size. Style each `Text` yourself.
- **Every `View` is a flex column** already. `flexDirection: 'row'` is how you go sideways, and `justifyContent` and `alignItems` work as in CSS flexbox.
- **No units, no shorthand strings** like `border: 1px solid red`. Use `borderWidth`, `borderColor`.

Don't write `style={{ marginTop: 12 }}` in the JSX. It works, but it hides your design in the markup, makes the same value drift across files, and creates a new object on every render. Name the style and put it in the `StyleSheet`.

## Combining styles

A style can be an **array**. Later entries win, and `false` entries are ignored, which makes conditions tidy:

```jsx
style={[styles.button, disabled && styles.buttonDisabled]}
```

`Pressable` also accepts a **function** that receives `{ pressed }`, so a button can look different while a finger is down:

```jsx
style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
```

## One source for colours

Typing `#1f6f78` in twelve places is how brands drift. Keep colours in `theme.js` and import them. Also check contrast: pale text on a mid-tone button is hard to read in sunlight, and the tests here measure it.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. The cards are squashed and the photo has vanished.
2. Open `tests/styling.test.jsx`. Each test names one thing a good card does.
3. In `components/RoomCard.jsx`, move the two inline style objects into `StyleSheet.create`, with sensible names.
4. Fix `card`, `photo` and `header`, and make the button text readable.
5. Make `buttonStyle` return `[styles.button, pressed && styles.buttonPressed]`, and add the `buttonPressed` style.
6. Replace every hex code with a value from `colors` in `theme.js`.
7. Press **Check my work**.
