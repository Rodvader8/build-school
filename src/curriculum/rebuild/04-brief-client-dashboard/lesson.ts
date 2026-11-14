import type { LessonMeta } from '../../types';
import { gateChecks } from '../../helpers';

export default {
  title: 'Brief 3: a client dashboard',
  minutes: 210,
  kind: 'project',
  entry: 'src/App.jsx',
  checkEntry: 'check.mjs',
  devPort: 4884,
  devCommand: 'npm run dev -- --port 4884 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: gateChecks(
    [
      'no figures are typed into the components',
      'the page has a skip link and a main landmark',
      'your tests cover sorting, the toggle and the chart',
    ],
    true,
  ),
  hints: ['Read BRIEF.md, then run the gate.'],
} satisfies LessonMeta;
