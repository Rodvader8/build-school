import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Styling with StyleSheet',
  minutes: 45,
  kind: 'project',
  entry: 'components/RoomCard.jsx',
  checkEntry: 'check.mjs',
  devPort: 4873,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4873',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the card has padding, rounded corners and a surface colour',
    'the photo fills the card width and has a fixed height',
    'the name and the price sit on one row, spread apart',
    'the name is bigger and bolder than the description',
    'the button text is easy to read against the button',
    'a pressed button gets its own look',
    'each room shows its price',
    'the web build exports',
    'styles live in StyleSheet.create, never as objects in the JSX',
    'colours come from theme.js, not typed into the component',
    'the exported app contains the prices',
  ]),
  hints: [
    'Every View lays its children out in a column. To put the name and price side by side use flexDirection: "row", then justifyContent: "space-between" to push them apart and alignItems: "center" to line them up vertically.',
    'An Image with only a width has no height, so it collapses to nothing. Give the photo width: "100%" and a height of about 140. Percentages are strings; plain numbers are density-independent pixels.',
    'buttonStyle is the function Pressable calls on every press and release. Return [styles.button, pressed && styles.buttonPressed]: React Native ignores false entries in a style array, so the pressed style is layered on only while pressed.',
  ],
} satisfies LessonMeta;
