import type { LessonMeta } from '../../types';
import { all, text } from '../../helpers';

export default {
  title: 'Lists',
  minutes: 8,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'A ul with four services', test: ({ doc }) => all(doc, 'ul > li').length >= 4 },
    { label: 'An ol with the four steps', test: ({ doc }) => all(doc, 'ol > li').length >= 4 },
    { label: 'Every list item has words in it', test: ({ doc }) => all(doc, 'li').length > 0 && all(doc, 'li').every((li) => text(li).length > 2) },
    { label: 'No typed dashes or numbers left in the items', test: ({ doc }) => all(doc, 'li').every((li) => !/^(-|\d+\.)\s/.test(text(li))) },
  ],
  hints: [
    'Wrap the whole group in <ul> ... </ul>, then each line in <li> ... </li>.',
    'Same for the steps, but with <ol> so they get numbers.',
  ],
} satisfies LessonMeta;
