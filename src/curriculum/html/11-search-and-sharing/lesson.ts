import type { LessonMeta } from '../../types';
import { text } from '../../helpers';

const meta = (doc: Document, sel: string) => doc.querySelector(sel)?.getAttribute('content')?.trim() ?? '';

export default {
  title: 'Search and sharing tags',
  minutes: 15,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'The title is 30 to 65 characters', test: ({ doc }) => { const n = text(doc.querySelector('title')).length; return n >= 30 && n <= 65; } },
    { label: 'A meta description of 120 to 160 characters', test: ({ doc }) => { const n = meta(doc, 'meta[name=description]').length; return n >= 120 && n <= 160; } },
    { label: 'Canonical points to https://larkfield.example/', test: ({ doc }) => doc.querySelector('link[rel=canonical]')?.getAttribute('href') === 'https://larkfield.example/' },
    { label: 'og:title and og:description are set', test: ({ doc }) => !!meta(doc, 'meta[property="og:title"]') && !!meta(doc, 'meta[property="og:description"]') },
    { label: 'og:image is a full https address ending in .jpg or .png', test: ({ doc }) => /^https:\/\/.+\.(jpe?g|png)$/i.test(meta(doc, 'meta[property="og:image"]')) },
    { label: 'A favicon link', test: ({ doc }) => !!doc.querySelector('link[rel~=icon]') },
  ],
  hints: [
    'To count characters, select the text in the editor. The blue status bar at the bottom shows how many are selected, just like VS Code.',
    'Open Graph tags use property, not name: <meta property="og:title" content="...">',
  ],
} satisfies LessonMeta;
