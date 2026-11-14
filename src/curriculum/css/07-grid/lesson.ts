import type { LessonMeta } from '../../types';
import { computed, ruleValue } from '../../helpers';

export default {
  title: 'CSS Grid: the cards',
  minutes: 15,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: '.nm-services is a grid', test: (c) => computed(c, '.nm-services', 'display') === 'grid' },
    { label: 'Columns use repeat(auto-fit, minmax(...))', test: ({ doc }) => /repeat\(\s*auto-(fit|fill)\s*,\s*minmax\(/.test(ruleValue(doc, '.nm-services', 'grid-template-columns')) },
    { label: 'Each column is at least 240px', test: ({ doc }) => /minmax\(\s*240px/.test(ruleValue(doc, '.nm-services', 'grid-template-columns')) },
    { label: 'A 24px gap between cards', test: (c) => computed(c, '.nm-services', 'row-gap') === '24px' && computed(c, '.nm-services', 'column-gap') === '24px' },
  ],
  hints: [
    'Copy the grid-template-columns line exactly first, then experiment once the checks pass.',
    'If the rule seems ignored, look for an earlier .nm-services rule. Both apply, and later declarations win.',
  ],
} satisfies LessonMeta;
