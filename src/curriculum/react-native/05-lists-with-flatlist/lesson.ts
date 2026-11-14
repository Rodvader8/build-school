import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Lists with FlatList and keys',
  minutes: 45,
  kind: 'project',
  entry: 'components/ArrivalsList.jsx',
  checkEntry: 'check.mjs',
  devPort: 4875,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4875',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'every arrival is listed with name, room and time',
    'an empty list shows a friendly message',
    'a row keeps its own state when the order changes',
    'a new arrival at the top does not steal the next guest\'s state',
    'a long list only draws the rows near the screen',
    'the list gives React no key warnings',
    'the web build exports',
    'the list is a FlatList, not a map inside a ScrollView',
    'keyExtractor uses the booking reference, never the index',
    'rows are separated and an empty list has a message',
    'the exported app contains the arrivals',
    'styles stay in StyleSheet.create',
  ]),
  hints: [
    'FlatList needs three props to start: data={arrivals}, renderItem={({ item }) => <ArrivalRow arrival={item} />}, and keyExtractor. renderItem receives an object, so destructure item out of it.',
    'keyExtractor={(item) => item.ref} returns a string that is unique and stays with the guest. The index changes when the order does, which is exactly what a key must not do.',
    'ListEmptyComponent takes an element (not a function) and shows it when data is empty. ItemSeparatorComponent takes a component, here the Separator already defined above.',
  ],
} satisfies LessonMeta;
