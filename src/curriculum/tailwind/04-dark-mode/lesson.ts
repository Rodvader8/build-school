import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Dark mode',
  minutes: 35,
  kind: 'project',
  entry: 'src/style.css',
  checkEntry: 'check.mjs',
  devPort: 4824,
  devCommand: 'npm run dev -- --port 4824 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: '@custom-variant makes dark: follow the dark class', test: ({ output }) => passed(output, '@custom-variant makes dark: follow the dark class') },
    { label: 'The built CSS keys dark: rules on the class, not the system setting', test: ({ output }) => passed(output, 'the built CSS keys dark: rules on the class, not the system setting') },
    { label: 'The page has light colours and dark: overrides for them', test: ({ output }) => passed(output, 'the page has light colours and dark: overrides for them') },
    { label: 'The toggle is a real button with aria-pressed', test: ({ output }) => passed(output, 'the toggle is a real button with aria-pressed') },
    { label: 'An inline script in the head applies the saved theme before paint', test: ({ output }) => passed(output, 'an inline script in the head applies the saved theme before paint') },
    { label: 'Clicking the button toggles dark, aria-pressed and the saved choice', test: ({ output }) => passed(output, 'clicking the button toggles dark, aria-pressed and the saved choice') },
    { label: 'Saving the choice is wrapped in try/catch', test: ({ output }) => passed(output, 'saving the choice is wrapped in try/catch') },
    { label: 'There are no inline styles', test: ({ output }) => passed(output, 'there are no inline styles') },
  ],
  hints: [
    'The whole class strategy is one line in style.css: @custom-variant dark (&:where(.dark, .dark *)); It says dark: applies to anything inside an element with the dark class, or the element itself.',
    'Always pair a light colour with its dark twin on the same element: bg-white dark:bg-slate-950. If you only add dark: classes, the light mode loses its colours.',
    'In theme.js, root.classList.toggle(\'dark\', dark) takes the wanted state as its second argument, which keeps the button and the class in step.',
  ],
} satisfies LessonMeta;
