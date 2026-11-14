Five components cover most of what a screen needs. Learn these and you can build a surprising amount before you ever need another.

## The five

**`View`** is the box. It's your `div`: it groups things and lays them out. It has no scrolling and no text of its own.

**`Text`** holds every word on screen. Text can't live directly inside a `View`. Inside a `Text`, though, you can nest more `Text` to bold one word.

**`Image`** shows a picture. It needs a `source`, and it needs a **size** (width and height in its style), because unlike a web `<img>`, it doesn't work out its own size from the file. Without a size, it's invisible.

```jsx
<Image source={room.photo} aria-label="Photo of the Loft" style={styles.photo} />
```

**`Pressable`** is the button. Wrap any content in it and give it `onPress`. That's React Native's `onClick`, and it covers fingers, mice and keyboards. There's also a built-in `Button`, but it's hard to style, so most apps use `Pressable` and put a `Text` inside.

**`ScrollView`** scrolls. A `View` never does, so a screen that fits on your laptop can run off the bottom of a phone. Wrap long content in a `ScrollView`. (For a long list of data, a later lesson shows `FlatList`, which is better.)

## Accessibility is part of the job

Phones ship with screen readers (VoiceOver, TalkBack), and the props are the same ones you'd use on the web: `aria-label` names something with no text (like a photo), and `role` says what it is (`role="heading"`, `role="button"`). A `Pressable` with only an icon in it must have an `aria-label`, or a blind user hears nothing at all.

## State works exactly as you know it

`useState` behaves the same as on the web. Here each card remembers its own "held" flag, so holding the Loft doesn't hold anything else.

```jsx
const [held, setHeld] = useState(false);
<Pressable onPress={() => setHeld(!held)}>...</Pressable>
```

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. You'll see three plain cards.
2. Open `tests/rooms.test.jsx`. It's a readable description of what the card should do.
3. In `components/RoomCard.jsx`, build the card: `Image` first, then the heading, then the description, then the `Pressable` that toggles "Hold this room" and "Held for 24 hours". The styles are already waiting at the bottom of the file.
4. In `App.jsx`, swap the outer `View` for a `ScrollView`.
5. Press **Check my work**.

> Tip: if the preview shows a card with no photo, check the Image's style. `styles.photo` is what gives it a height.
