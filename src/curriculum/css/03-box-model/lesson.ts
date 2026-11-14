import type { LessonMeta } from '../../types';
import { computed } from '../../helpers';

export default {
  title: 'The box model',
  minutes: 15,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Every element uses box-sizing: border-box', test: (c) => computed(c, '.nm-card', 'box-sizing') === 'border-box' && computed(c, 'p', 'box-sizing') === 'border-box' },
    { label: 'body has no margin', test: (c) => computed(c, 'body', 'margin-top') === '0px' && computed(c, 'body', 'margin-left') === '0px' },
    { label: 'Images never overflow (max-width: 100%)', test: (c) => computed(c, 'img', 'max-width') === '100%' },
    { label: 'Sections have 96px above and below, 24px at the sides', test: (c) => computed(c, '.nm-section', 'padding-top') === '96px' && computed(c, '.nm-section', 'padding-left') === '24px' },
    { label: 'The services list has no bullets', test: (c) => computed(c, '.nm-services', 'list-style-type') === 'none' && computed(c, '.nm-services', 'padding-left') === '0px' },
    { label: 'Cards: 24px padding, 1px border, 16px corners, #141b2d', test: (c) => computed(c, '.nm-card', 'padding-top') === '24px' && computed(c, '.nm-card', 'border-top-width') === '1px' && computed(c, '.nm-card', 'border-top-left-radius') === '16px' && computed(c, '.nm-card', 'background-color') === 'rgb(20, 27, 45)' },
  ],
  hints: [
    'Two values in padding mean top-and-bottom, then left-and-right: padding: 96px 24px;',
    'border is shorthand for width, style and colour: border: 1px solid rgba(232, 228, 218, 0.14);',
  ],
} satisfies LessonMeta;
