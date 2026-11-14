import type { LessonMeta } from '../../types';
import { callGlobal, errors, logLines } from '../../helpers';

export default {
  title: 'Functions',
  minutes: 15,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'formatFee(4400) returns \'$4,400\'', test: ({ win }) => callGlobal(win, 'formatFee', 4400) === '$4,400' },
    { label: 'formatFee(13200) returns \'$13,200\'', test: ({ win }) => callGlobal(win, 'formatFee', 13200) === '$13,200' },
    { label: 'withGst(4400) returns 4840 (rounded)', test: ({ win }) => callGlobal(win, 'withGst', 4400) === 4840 },
    { label: 'withGst(7700) returns 8470 and withGst(3) returns 3', test: ({ win }) => callGlobal(win, 'withGst', 7700) === 8470 && callGlobal(win, 'withGst', 3) === 3 },
    { label: 'withGst is an arrow function', test: ({ files }) => /withGst\s*=\s*\(?\s*\w+\s*\)?\s*=>/.test(files['script.js'] ?? '') },
    { label: 'You logged $14,520', test: ({ win }) => logLines(win).includes('$14,520') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Join strings with +: \'$\' + amount.toLocaleString(\'en-AU\')',
    'withGst(3) is 3.3 before rounding, so Math.round gives 3.',
    'Call one function inside another: formatFee(withGst(13200))',
  ],
} satisfies LessonMeta;
