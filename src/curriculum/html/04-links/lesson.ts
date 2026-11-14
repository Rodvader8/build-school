import type { LessonMeta } from '../../types';
import { all, text } from '../../helpers';

export default {
  title: 'Links',
  minutes: 10,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'Moneysmart links to https://www.moneysmart.gov.au', test: ({ doc }) => all(doc, 'a[href^="https://"]').some((a) => a.getAttribute('href')!.includes('moneysmart.gov.au') && text(a) === 'Moneysmart') },
    { label: 'The fees heading has id="fees"', test: ({ doc }) => doc.getElementById('fees')?.tagName === 'H2' },
    { label: '"See our fees" jumps to #fees', test: ({ doc }) => all(doc, 'a[href="#fees"]').some((a) => /see our fees/i.test(text(a))) },
    { label: 'The email is a mailto: link', test: ({ doc }) => !!doc.querySelector('a[href="mailto:hello@larkfield.example"]') },
  ],
  hints: [
    'Wrap just the one word: ...see <a href="https://www.moneysmart.gov.au">Moneysmart</a>...',
    'The id goes inside the opening tag: <h2 id="fees">What we charge</h2>',
    'In-page links start with a hash: <a href="#fees">See our fees</a>',
  ],
} satisfies LessonMeta;
