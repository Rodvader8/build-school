import type { LessonMeta } from '../../types';
import { gateChecks } from '../../helpers';

export default {
  title: 'Brief 2: a multi-page service site',
  minutes: 180,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4883,
  devCommand: 'npm run dev -- --port 4883 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: gateChecks([
    'four pages are built: home, services, about and contact',
    'every page has its own title and description, from the data',
    'every page has one header and footer, and marks the current page',
    'every page says what the data file says',
    'no copy is typed into the page templates',
    'the contact page has a labelled enquiry form',
    'the questions are details and summary',
    'every image has useful alt text, and each page loads at most one eagerly',
    'every internal link goes somewhere that exists',
  ]),
  hints: ['Read BRIEF.md, then run the gate.'],
} satisfies LessonMeta;
