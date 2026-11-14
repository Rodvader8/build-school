import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Components without repeating yourself',
  minutes: 40,
  kind: 'project',
  entry: 'src/components.js',
  checkEntry: 'check.mjs',
  devPort: 4825,
  devCommand: 'npm run dev -- --port 4825 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'Card() returns a card for one entity', test: ({ output }) => passed(output, 'card() returns a card for one entity') },
    { label: 'The card\'s class list is written once', test: ({ output }) => passed(output, 'the card\'s class list is written once') },
    { label: 'Main.js renders every entity through card()', test: ({ output }) => passed(output, 'main.js renders every entity through card()') },
    { label: 'Data is escaped before it goes into HTML', test: ({ output }) => passed(output, 'data is escaped before it goes into HTML') },
    { label: 'Index.html has no pasted cards left', test: ({ output }) => passed(output, 'index.html has no pasted cards left') },
    { label: '.btn is built with @apply', test: ({ output }) => passed(output, '.btn is built with @apply') },
    { label: '@apply carries at least five utilities, including a state', test: ({ output }) => passed(output, '@apply carries at least five utilities, including a state') },
    { label: 'Tailwind still finds the classes inside the JavaScript', test: ({ output }) => passed(output, 'Tailwind still finds the classes inside the JavaScript') },
    { label: 'There are no inline styles', test: ({ output }) => passed(output, 'there are no inline styles') },
  ],
  hints: [
    'card({ name, type, value }) can be a function that returns a template literal with ${name} placeholders. Keep the class list inside the template, written out in full.',
    'entities.map(card) calls card once for each entity and gives back an array of strings. .join(\'\') glues them into one string for innerHTML.',
    '@apply goes inside a normal rule: .btn { @apply inline-block rounded-full px-5 py-2 hover:bg-cream; } It accepts every variant you\'ve used in markup.',
  ],
} satisfies LessonMeta;
