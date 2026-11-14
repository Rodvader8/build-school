import type { LessonMeta } from '../../types';
import { all, text } from '../../helpers';

export default {
  title: 'Headings and paragraphs',
  minutes: 8,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'Exactly one h1', test: ({ doc }) => all(doc, 'h1').length === 1 },
    { label: 'The h1 says "Larkfield Private Wealth"', test: ({ doc }) => text(doc.querySelector('h1')) === 'Larkfield Private Wealth' },
    {
      label: '"How we work" and "What we charge" are h2 headings',
      test: ({ doc }) => {
        const h2s = all(doc, 'h2').map(text);
        return h2s.includes('How we work') && h2s.includes('What we charge');
      },
    },
    { label: 'Three paragraphs (p)', test: ({ doc }) => all(doc, 'p').filter((p) => text(p).length > 10).length >= 3 },
  ],
  hints: [
    'Put the opening tag right before the words and the closing tag right after: <h2>How we work</h2>',
    'Each sentence gets its own pair: <p>...</p>. You should end up with three of them.',
  ],
} satisfies LessonMeta;
