import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Responsive and state variants',
  minutes: 35,
  kind: 'project',
  entry: 'index.html',
  checkEntry: 'check.mjs',
  devPort: 4823,
  devCommand: 'npm run dev -- --port 4823 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'The grid goes 1, 2 then 3 columns as the screen grows', test: ({ output }) => passed(output, 'the grid goes 1, 2 then 3 columns as the screen grows') },
    { label: 'Padding or type size steps up at md', test: ({ output }) => passed(output, 'padding or type size steps up at md') },
    { label: 'The cards react to hover', test: ({ output }) => passed(output, 'the cards react to hover') },
    { label: 'The links have a visible focus-visible style', test: ({ output }) => passed(output, 'the links have a visible focus-visible style') },
    { label: 'Movement is added with motion-safe', test: ({ output }) => passed(output, 'movement is added with motion-safe') },
    { label: 'The pulsing dot stops with motion-reduce', test: ({ output }) => passed(output, 'the pulsing dot stops with motion-reduce') },
    { label: 'There are no inline styles', test: ({ output }) => passed(output, 'there are no inline styles') },
  ],
  hints: [
    'Tailwind is mobile first. grid-cols-1 with no prefix is the phone layout, and sm:grid-cols-2 means "from 40rem wide and up".',
    'Prefixes stack, left to right: motion-safe:hover:-translate-y-1 only applies when the pointer is over the card and the visitor hasn\'t asked for less motion.',
    'focus-visible: shows the style for keyboard users and hides it for mouse clicks. Use an outline with an offset so it stays visible on a dark background.',
  ],
} satisfies LessonMeta;
