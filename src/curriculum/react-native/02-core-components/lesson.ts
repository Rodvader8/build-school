import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Core components: View, Text, Image, Pressable, ScrollView',
  minutes: 40,
  kind: 'project',
  entry: 'components/RoomCard.jsx',
  checkEntry: 'check.mjs',
  devPort: 4872,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4872',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'every room has a name heading and a description',
    'every room has a photo with text for screen readers',
    'pressing Hold this room holds it, and pressing again lets it go',
    'holding one room leaves the others alone',
    'the list gives React a key for every room',
    'the web build exports',
    'the screen scrolls because it uses a ScrollView',
    'the card uses Image and Pressable, not HTML tags',
    'the exported app contains the room names',
  ]),
  hints: [
    'Image takes source={room.photo} (the data file imports the picture for you) and aria-label for the screen-reader description. Give it style={styles.photo} so it has a size: an Image with no width and height is invisible.',
    'Pressable wraps a Text. Its onPress runs when someone taps (or clicks on the web). Toggle with setHeld(!held), and choose the words with {held ? "Held for 24 hours" : "Hold this room"}.',
    'ScrollView takes the container\'s two style props: style for the scroll area itself and contentContainerStyle for the padding around what\'s inside.',
  ],
} satisfies LessonMeta;
