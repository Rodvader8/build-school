import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Expo setup and Expo Go',
  minutes: 40,
  kind: 'project',
  entry: 'App.jsx',
  checkEntry: 'check.mjs',
  devPort: 4871,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4871',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the app shows the hotel name as a heading',
    'the app shows a tagline under the heading',
    'the web build exports',
    'app.json has a name and a web-safe slug',
    'index.js registers the root component',
    'Expo, React and React Native are pinned to exact versions',
    'the app uses React Native components, not HTML tags',
    'the exported app contains the hotel name',
  ]),
  hints: [
    'A heading is <Text role="heading" aria-level={1}>Hotel Marlow</Text>. React Native has no <h1>, so the role tells screen readers (and the web) what it is.',
    'The tagline is another Text, with testID="tagline" so the test can find it. Put the styles it needs in the StyleSheet.create block at the bottom, which already has title and tagline ready.',
    'In app.json, "name" is what people see under the icon and "slug" is the URL-friendly id, so lowercase words with hyphens: "hotel-marlow".',
  ],
} satisfies LessonMeta;
