import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Project: the owner\'s morning view',
  minutes: 70,
  kind: 'project',
  entry: 'app/index.jsx',
  checkEntry: 'check.mjs',
  devPort: 4877,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4877',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'occupancyPercent gives a whole percentage and never NaN',
    'sortByArrival puts the earliest first without touching the original',
    'earlyArrivals keeps only arrivals before 2pm',
    'the occupancy card says how many rooms are occupied and the percentage',
    'the occupancy card draws one dot per room, filled for the occupied ones',
    'arrivals are listed earliest first',
    'the toggle is labelled so a screen reader can find it',
    'turning the toggle on shows only early arrivals, and off brings everyone back',
    'a long list only draws the rows near the screen',
    'with nobody early, the toggle shows a friendly message',
    'the web build exports',
    'the arrivals are a FlatList keyed by booking reference',
    'every component keeps its styles in StyleSheet.create, with none in the JSX',
    'colours come from theme.js',
    'the app uses expo-router with a Stack layout',
    'the exported app contains the morning view',
  ]),
  hints: [
    'Start with lib/summary.js, since the rest depends on it. occupancyPercent is total > 0 ? Math.round((occupied / total) * 100) : 0. For sorting, [...arrivals].sort(...) makes a copy first, because .sort changes the array it is called on.',
    'The dots: const dots = Array.from({ length: total }, (_, i) => i < occupied) gives one true or false per room. Map those to Views, with the testID and style chosen by the boolean. No dynamic width needed, so every style stays in the StyleSheet.',
    'Don\'t store the filtered list in state. Keep only earlyOnly in state and work the list out while rendering: const shown = sortByArrival(earlyOnly ? earlyArrivals(arrivals) : arrivals). It can never get out of step with the toggle.',
  ],
} satisfies LessonMeta;
