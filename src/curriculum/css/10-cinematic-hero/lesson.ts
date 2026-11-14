import type { LessonMeta } from '../../types';
import { computed, px, ruleValue } from '../../helpers';

export default {
  title: 'A cinematic hero',
  minutes: 20,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'The hero is position: relative', test: (c) => computed(c, '.nm-hero', 'position') === 'relative' },
    { label: 'It is at least 80% of the screen tall (vh)', test: ({ doc }) => /^(80|8\d|9\d|100)s?vh$/.test(ruleValue(doc, '.nm-hero', 'min-height')) },
    { label: 'The image fills it: absolute and object-fit: cover', test: (c) => computed(c, '.nm-hero-img', 'position') === 'absolute' && computed(c, '.nm-hero-img', 'object-fit') === 'cover' },
    { label: 'A gradient shade on .nm-hero::after', test: (c) => computed(c, '.nm-hero', 'background-image', '::after').includes('linear-gradient') && computed(c, '.nm-hero', 'position', '::after') === 'absolute' },
    { label: 'The copy sits above the shade (z-index)', test: (c) => computed(c, '.nm-hero-copy', 'position') === 'relative' && Number(computed(c, '.nm-hero-copy', 'z-index')) >= 1 },
    { label: 'The eyebrow is gold, spaced capitals', test: (c) => computed(c, '.nm-eyebrow', 'text-transform') === 'uppercase' && px(computed(c, '.nm-eyebrow', 'letter-spacing')) > 0 && computed(c, '.nm-eyebrow', 'color') === 'rgb(242, 195, 139)' },
  ],
  hints: [
    '::after only appears when it has content. content: \'\'; (two quote marks) is enough.',
    'If the shade covers your words, the copy is missing position: relative and z-index: 1.',
  ],
} satisfies LessonMeta;
