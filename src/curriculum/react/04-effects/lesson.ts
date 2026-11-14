import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Effects with useEffect',
  minutes: 40,
  kind: 'project',
  entry: 'src/components/NetWorth.jsx',
  checkEntry: 'check.mjs',
  devPort: 4834,
  devCommand: 'npm run dev -- --port 4834 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The browser tab title follows the chosen period', test: ({ output }) => passed(output, 'the browser tab title follows the chosen period') },
    { label: 'Choosing a period renders once, because the change is worked out while rendering', test: ({ output }) => passed(output, 'choosing a period renders once, because the change is worked out while rendering') },
    { label: 'Shows the time and ticks every second', test: ({ output }) => passed(output, 'shows the time and ticks every second') },
    { label: 'Stops its timer when it leaves the page', test: ({ output }) => passed(output, 'stops its timer when it leaves the page') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'An effect is for syncing with something outside React, like the tab title or a timer. Put the work in useEffect(() => { ... }, [period]) and list every value it reads in the array.',
    'To remove the extra render, delete the change state and the effect that sets it, and compute diff and percent in the function body from history[period], just like in the State lesson.',
    'For the clock, return a function from the effect: const id = setInterval(...); return () => clearInterval(id); React calls it when the component leaves the page.',
  ],
} satisfies LessonMeta;
