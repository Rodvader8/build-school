import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Utility-first thinking',
  minutes: 30,
  kind: 'project',
  entry: 'index.html',
  checkEntry: 'check.mjs',
  devPort: 4821,
  devCommand: 'npm run dev -- --port 4821 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'The card is built from utility classes', test: ({ output }) => passed(output, 'the card is built from utility classes') },
    { label: 'It has padding and rounded corners', test: ({ output }) => passed(output, 'it has padding and rounded corners') },
    { label: 'It has background, text and border colours', test: ({ output }) => passed(output, 'it has background, text and border colours') },
    { label: 'It lays out with flex or grid and a gap', test: ({ output }) => passed(output, 'it lays out with flex or grid and a gap') },
    { label: 'It sets a type size and weight', test: ({ output }) => passed(output, 'it sets a type size and weight') },
    { label: 'The link has a hover state', test: ({ output }) => passed(output, 'the link has a hover state') },
    { label: 'style.css has no rules of its own', test: ({ output }) => passed(output, 'style.css has no rules of its own') },
    { label: 'There are no inline styles', test: ({ output }) => passed(output, 'there are no inline styles') },
    { label: 'The markup keeps its meaning', test: ({ output }) => passed(output, 'the markup keeps its meaning') },
  ],
  hints: [
    'Every utility is one declaration with a name you can guess: p-6 is padding, rounded-2xl is a big radius, text-sm is a small font size, gap-2 is the space between flex children.',
    'Start with the article: flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-6. Then style each paragraph on its own line.',
    'Add hover: in front of any utility to apply it only on hover, for example hover:bg-cyan-300 on the link.',
  ],
} satisfies LessonMeta;
