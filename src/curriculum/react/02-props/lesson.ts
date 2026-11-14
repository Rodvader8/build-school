import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Props',
  minutes: 35,
  kind: 'project',
  entry: 'src/components/KpiCard.jsx',
  checkEntry: 'check.mjs',
  devPort: 4832,
  devCommand: 'npm run dev -- --port 4832 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Shows its label and the value as dollars', test: ({ output }) => passed(output, 'shows its label and the value as dollars') },
    { label: 'A positive change reads Up and gets the is-up class', test: ({ output }) => passed(output, 'a positive change reads Up and gets the is-up class') },
    { label: 'A negative change reads Down without the minus sign and gets the is-down class', test: ({ output }) => passed(output, 'a negative change reads Down without the minus sign and gets the is-down class') },
    { label: 'No change prop means no change line at all', test: ({ output }) => passed(output, 'no change prop means no change line at all') },
    { label: 'Children are shown inside the card', test: ({ output }) => passed(output, 'children are shown inside the card') },
    { label: 'Different props give different cards from the same component', test: ({ output }) => passed(output, 'different props give different cards from the same component') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'A component receives one object of props. Destructure it in the parameter list: function KpiCard({ label, value, change, children }) { ... }',
    'Optional means it can be undefined, so test for that: {change !== undefined && (<p>...</p>)} shows the paragraph only when a change was passed.',
    'Class names can be built from props with a template string: className={`kpi-change is-${direction}`}, where direction is \'up\' or \'down\' depending on the sign of change.',
  ],
} satisfies LessonMeta;
