import type { LessonMeta } from '../../types';
import { all, controlsLabelled, headingsInOrder, text } from '../../helpers';

export default {
  title: 'Accessibility basics',
  minutes: 15,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'The page has a lang', test: ({ doc }) => !!doc.documentElement.getAttribute('lang') },
    { label: 'Every image has an alt attribute', test: ({ doc }) => all(doc, 'img').every((i) => i.hasAttribute('alt')) },
    { label: 'Headings never skip a level', test: ({ doc }) => headingsInOrder(doc) },
    { label: 'Every form field has a label', test: ({ doc }) => controlsLabelled(doc) },
    { label: 'No "click here" or "here" links', test: ({ doc }) => all(doc, 'a').every((a) => !/^(click here|here|read more)$/i.test(text(a))) },
    { label: 'The nav has an aria-label', test: ({ doc }) => !!doc.querySelector('nav')?.getAttribute('aria-label') },
  ],
  hints: [
    'Start at the top of the file: what\'s missing on the <html> tag?',
    'The "Our fees" heading sits under an h2 section. What level should it be?',
    'Rewrite "click here" so the link itself says where it goes, like "Read our fee guide".',
  ],
} satisfies LessonMeta;
