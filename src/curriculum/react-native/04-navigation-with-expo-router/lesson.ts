import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Navigation with expo-router',
  minutes: 50,
  kind: 'project',
  entry: 'app/index.jsx',
  checkEntry: 'check.mjs',
  devPort: 4874,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4874',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the home screen links every room to its own address',
    'the detail screen reads the room id from the address',
    'an unknown room id says so instead of crashing',
    'the detail screen titles its header with the room name',
    'the detail screen has a link back to the list',
    'the layout is a Stack with a titled screen for the list and one for room details',
    'the web build exports',
    'the app is organised as files in app/: _layout, index and rooms/[id]',
    'expo-router is set up: the plugin, a scheme and its entry point',
    'the exported app includes the detail screen',
    'styles stay in StyleSheet.create',
  ]),
  hints: [
    'A Link takes the address in href. Inside the map, href={`/rooms/${room.id}`} gives each room its own address, and the text between the tags is what people tap.',
    'In app/rooms/[id].jsx, const { id } = useLocalSearchParams() gives the part of the address that matched [id]. Find the room with rooms.find((r) => r.id === id), and return early when it is undefined.',
    'A <Stack> in _layout.jsx needs no children to work, but listing <Stack.Screen name="index" options={{ title: "Hotel Marlow" }} /> lets you give each screen its header title. The name is the file path without the extension.',
  ],
} satisfies LessonMeta;
