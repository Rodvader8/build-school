import type { LessonMeta } from '../../types';
import { callGlobal, errors, globalValue } from '../../helpers';

export default {
  title: 'Loops and conditions',
  minutes: 15,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'total is 27500, added up with for...of', test: ({ win, files }) => globalValue(win, 'total') === 27500 && /for\s*\(\s*(const|let)\s+\w+\s+of\s+plans/.test(files['script.js'] ?? '') },
    { label: 'premium is [\'Family\', \'Private\']', test: ({ win }) => JSON.stringify(globalValue(win, 'premium')) === '["Family","Private"]' },
    { label: 'premium uses an if', test: ({ files }) => /if\s*\(/.test(files['script.js'] ?? '') },
    { label: 'bandFor gives entry, mid and top', test: ({ win }) => callGlobal(win, 'bandFor', 2200) === 'entry' && callGlobal(win, 'bandFor', 7700) === 'mid' && callGlobal(win, 'bandFor', 13200) === 'top' },
    { label: 'bandFor gets the edges right (4999, 5000, 9999, 10000)', test: ({ win }) => ['entry', 'mid', 'mid', 'top'].every((band, i) => callGlobal(win, 'bandFor', [4999, 5000, 9999, 10000][i]) === band) },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'total has to be let, because the loop keeps changing it.',
    'Inside the premium loop: if (plan.fee >= 7000) { premium.push(plan.name); }',
    'Use < not <= in bandFor, so 5000 falls into mid.',
  ],
} satisfies LessonMeta;
