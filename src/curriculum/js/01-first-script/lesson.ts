import type { LessonMeta } from '../../types';
import { errors, logLines } from '../../helpers';

export default {
  title: 'Your first script',
  minutes: 10,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'index.html loads script.js', test: ({ doc }) => !!doc.querySelector('script[src$="script.js"]') },
    { label: 'You logged a greeting (a sentence in quotes)', test: ({ win }) => logLines(win).some((l) => /[a-z]{3,}/i.test(l) && l.trim().length >= 5) },
    { label: 'You logged the total of the three fees: 25300', test: ({ win }) => logLines(win).includes('25300') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'The script tag goes in index.html, not script.js. Switch tabs at the top of the editor.',
    'console.log(\'Hello from the Larkfield dashboard\'); Mind the quotes and the closing bracket.',
    'For the total, no quotes: console.log(4400 + 7700 + 13200);',
  ],
} satisfies LessonMeta;
