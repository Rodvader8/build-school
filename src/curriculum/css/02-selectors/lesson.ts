import type { LessonMeta } from '../../types';
import { computed, ruleValue } from '../../helpers';

export default {
  title: 'Selectors and the cascade',
  minutes: 15,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Paragraphs are muted (#b8b2a4)', test: (c) => computed(c, '#services p', 'color') === 'rgb(184, 178, 164)' },
    { label: '.nm-lede beats p: #e8e4da at 1.25rem', test: (c) => computed(c, '.nm-lede', 'color') === 'rgb(232, 228, 218)' && computed(c, '.nm-lede', 'font-size') === '20px' },
    { label: 'Menu links are #e8e4da with no underline', test: (c) => computed(c, '.nm-nav a', 'color') === 'rgb(232, 228, 218)' && computed(c, '.nm-nav a', 'text-decoration-line') === 'none' },
    { label: 'Menu links turn gold on hover', test: ({ doc }) => /242, 195, 139|#f2c38b/i.test(ruleValue(doc, '.nm-nav a:hover', 'color')) },
    { label: 'Menu links have a focus-visible outline', test: ({ doc }) => !!ruleValue(doc, '.nm-nav a:focus-visible', 'outline') || !!ruleValue(doc, '.nm-nav a:focus-visible', 'outline-style') },
  ],
  hints: [
    'A class selector starts with a dot: .nm-lede { ... }. An element selector doesn\'t: p { ... }.',
    'For hover, put the pseudo-class straight after the selector with no space: .nm-nav a:hover',
    '1.25rem means 1.25 times the root font size, which is 16px by default, so 20px.',
  ],
} satisfies LessonMeta;
