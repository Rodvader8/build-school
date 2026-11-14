import type { LessonMeta } from '../../types';
import { hasText } from '../../helpers';

export default {
  title: 'Your first web page',
  minutes: 5,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'There is an h1 heading', test: ({ doc }) => !!doc.querySelector('h1') },
    { label: 'The h1 has some words in it', test: ({ doc }) => hasText(doc.querySelector('h1'), 3) },
    { label: 'There is a paragraph (p) with a sentence in it', test: ({ doc }) => hasText(doc.querySelector('p'), 10) },
    { label: 'Both are closed with </h1> and </p>', test: ({ files }) => /<\/h1>/i.test(files['index.html'] ?? '') && /<\/p>/i.test(files['index.html'] ?? '') },
    { label: 'The paragraph sits after the heading, not inside it', test: ({ doc }) => !doc.querySelector('h1 p') },
  ],
  hints: [
    'An h1 looks like this: <h1>My heading</h1>. Don\'t forget the slash in the closing tag.',
    'A paragraph looks like this: <p>I want to build websites for my clients.</p>',
  ],
} satisfies LessonMeta;
