import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'State with useState',
  minutes: 35,
  kind: 'project',
  entry: 'src/components/NetWorth.jsx',
  checkEntry: 'check.mjs',
  devPort: 4833,
  devCommand: 'npm run dev -- --port 4833 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Starts on 1Y with the figure and the change for that period', test: ({ output }) => passed(output, 'starts on 1Y with the figure and the change for that period') },
    { label: 'Every period button says whether it is pressed', test: ({ output }) => passed(output, 'every period button says whether it is pressed') },
    { label: 'Choosing 5Y updates the change line and the pressed button', test: ({ output }) => passed(output, 'choosing 5Y updates the change line and the pressed button') },
    { label: 'You can move between periods and the numbers follow', test: ({ output }) => passed(output, 'you can move between periods and the numbers follow') },
    { label: 'The explanation is hidden until asked for, then can be hidden again', test: ({ output }) => passed(output, 'the explanation is hidden until asked for, then can be hidden again') },
    { label: 'Each copy of the component keeps its own state', test: ({ output }) => passed(output, 'each copy of the component keeps its own state') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'useState gives you a pair: const [period, setPeriod] = useState(\'1Y\'); The first is the current value, the second is the only way to change it. Import it with import { useState } from \'react\';',
    'Don\'t store the figure or the percentage in state. Store only the period, and work the rest out in the function body each time it renders.',
    'aria-pressed={p === period} gives each button true or false, and onClick={() => setPeriod(p)} changes the state. For the explanation, a boolean works: onClick={() => setShowNote(!showNote)}.',
  ],
} satisfies LessonMeta;
