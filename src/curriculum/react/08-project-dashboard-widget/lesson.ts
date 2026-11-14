import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Project: a dashboard widget',
  minutes: 75,
  kind: 'project',
  entry: 'src/components/Dashboard.jsx',
  checkEntry: 'check.mjs',
  devPort: 4838,
  devCommand: 'npm run dev -- --port 4838 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Shows the total value of every entity', test: ({ output }) => passed(output, 'shows the total value of every entity') },
    { label: 'Shows the weighted return for 1Y to begin with', test: ({ output }) => passed(output, 'shows the weighted return for 1Y to begin with') },
    { label: 'Choosing a period updates the return and the pressed button', test: ({ output }) => passed(output, 'choosing a period updates the return and the pressed button') },
    { label: 'Has a name, four column headers and one row per entity in the given order', test: ({ output }) => passed(output, 'has a name, four column headers and one row per entity in the given order') },
    { label: 'Clicking a header sorts ascending, then descending', test: ({ output }) => passed(output, 'clicking a header sorts ascending, then descending') },
    { label: 'A different header starts ascending again and the others reset', test: ({ output }) => passed(output, 'a different header starts ascending again and the others reset') },
    { label: 'The Return column shows the chosen period and sorts by it', test: ({ output }) => passed(output, 'the Return column shows the chosen period and sorts by it') },
    { label: 'Saves the chosen period and restores it on the next visit', test: ({ output }) => passed(output, 'saves the chosen period and restores it on the next visit') },
    { label: 'Ignores a saved value that is not a real period', test: ({ output }) => passed(output, 'ignores a saved value that is not a real period') },
    { label: 'The header buttons have a visible focus-visible style', test: ({ output }) => passed(output, 'the header buttons have a visible focus-visible style') },
    { label: 'Movement respects reduced motion', test: ({ output }) => passed(output, 'movement respects reduced motion') },
    { label: 'Colours come from the theme, not one-off values', test: ({ output }) => passed(output, 'colours come from the theme, not one-off values') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'Plan the state first: period (restored from localStorage with a function passed to useState so it only reads once) and sort as { key, dir }. The return, the sorted rows and the pressed buttons are all worked out while rendering.',
    'Sort a copy: [...entities].sort(...). Compare numbers by subtraction and strings with a.localeCompare(b), and negate the result for descending. For the Return column, compare entity.returns[period] so it follows the toggle.',
    'For the header click, setSort((current) => ({ key, dir: current.key === key && current.dir === \'ascending\' ? \'descending\' : \'ascending\' })) gives you ascending on a new column and flips on the same one.',
  ],
} satisfies LessonMeta;
