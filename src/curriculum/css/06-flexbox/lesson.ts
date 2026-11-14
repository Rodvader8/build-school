import type { LessonMeta } from '../../types';
import { all, computed } from '../../helpers';

export default {
  title: 'Flexbox: the header',
  minutes: 15,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: '.nm-header is a flex container', test: (c) => computed(c, '.nm-header', 'display') === 'flex' },
    { label: 'Logo and menu pushed apart and centred', test: (c) => computed(c, '.nm-header', 'justify-content') === 'space-between' && computed(c, '.nm-header', 'align-items') === 'center' },
    { label: 'The header has 20px / 24px padding', test: (c) => computed(c, '.nm-header', 'padding-top') === '20px' && computed(c, '.nm-header', 'padding-left') === '24px' },
    { label: 'The menu is a flex row with a 24px gap', test: (c) => computed(c, '.nm-nav-list', 'display') === 'flex' && computed(c, '.nm-nav-list', 'column-gap') === '24px' },
    { label: 'The menu has no bullets or indent', test: (c) => computed(c, '.nm-nav-list', 'list-style-type') === 'none' && computed(c, '.nm-nav-list', 'padding-left') === '0px' },
    { label: 'All four menu links sit on one line', test: ({ doc }) => new Set(all(doc, '.nm-nav-list li').map((li) => Math.round(li.getBoundingClientRect().top))).size === 1 },
    { label: 'The logo is #e8e4da, bold, not underlined', test: (c) => computed(c, '.nm-logo', 'color') === 'rgb(232, 228, 218)' && computed(c, '.nm-logo', 'font-weight') === '600' && computed(c, '.nm-logo', 'text-decoration-line') === 'none' },
  ],
  hints: [
    'Two separate rules: one for .nm-header and one for .nm-nav-list.',
    'gap only works on flex or grid containers, so it does nothing until display: flex is there.',
  ],
} satisfies LessonMeta;
