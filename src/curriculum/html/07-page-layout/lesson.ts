import type { LessonMeta } from '../../types';
import { all } from '../../helpers';

export default {
  title: 'Page layout tags',
  minutes: 12,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'header contains a nav with the menu links', test: ({ doc }) => all(doc, 'header nav a').length >= 2 },
    { label: 'One main, holding the h1', test: ({ doc }) => all(doc, 'main').length === 1 && !!doc.querySelector('main h1') },
    { label: 'Two sections inside main, each with an h2', test: ({ doc }) => all(doc, 'main section').filter((s) => s.querySelector('h2')).length >= 2 },
    { label: 'The sections have ids approach and fees', test: ({ doc }) => doc.getElementById('approach')?.tagName === 'SECTION' && doc.getElementById('fees')?.tagName === 'SECTION' },
    { label: 'A footer after main', test: ({ doc }) => !!doc.querySelector('main ~ footer') },
  ],
  hints: [
    'Order inside body: <header>...</header> then <main>...</main> then <footer>...</footer>.',
    'Move the ids onto the section tags: <section id="approach"> ... </section>',
  ],
} satisfies LessonMeta;
