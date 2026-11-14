import type { LessonMeta } from '../../types';
import { hasText } from '../../helpers';

const img = (doc: Document) => doc.querySelector('figure img');

export default {
  title: 'Images',
  minutes: 10,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'An img inside the figure shows images/headland.svg', test: ({ doc }) => img(doc)?.getAttribute('src')?.replace(/^\.\//, '') === 'images/headland.svg' },
    { label: 'The image has a useful alt (10+ characters)', test: ({ doc }) => (img(doc)?.getAttribute('alt') ?? '').trim().length >= 10 },
    { label: 'width="1200" and height="600" are set', test: ({ doc }) => img(doc)?.getAttribute('width') === '1200' && img(doc)?.getAttribute('height') === '600' },
    { label: 'The figure has a figcaption', test: ({ doc }) => hasText(doc.querySelector('figure figcaption'), 5) },
  ],
  hints: [
    'img has no closing tag: <img src="images/headland.svg" alt="..." width="1200" height="600">',
    'Describe the picture, not the file. "headland.svg" or "image" are not good alt text.',
  ],
} satisfies LessonMeta;
