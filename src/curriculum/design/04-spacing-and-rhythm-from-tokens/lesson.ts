import type { LessonMeta } from '../../types';
import { computed, px, spacingValues, withoutRoot } from '../../helpers';

const onGrid = (v: number) => Math.abs(v - Math.round(v)) < 0.01 && (Math.round(v) % 8 === 0 || Math.round(v) === 4);

export default {
  title: 'Spacing and rhythm from tokens',
  minutes: 30,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Spacing tokens --space-1 to --space-6 are defined on :root', test: ({ doc, win }) => [1, 2, 3, 4, 5, 6].every((i) => win.getComputedStyle(doc.documentElement).getPropertyValue(`--space-${i}`).trim() !== '') },
    { label: 'Every padding, gap and vertical margin on the page is a multiple of 8px (or 4px)', test: (c) => spacingValues(c).every((s) => onGrid(s.value)) },
    { label: 'Spacing declarations use var(--space-...) at least 6 times', test: ({ files }) => (withoutRoot(files['style.css'] ?? '').match(/var\(--space-\d/g) ?? []).length >= 6 },
    { label: 'No raw px, rem or em lengths in padding, margin or gap rules', test: ({ files }) => !/(?:padding|margin|gap)[\w-]*\s*:[^;{}]*\d(?:px|rem|em)\b/.test(withoutRoot(files['style.css'] ?? '')) },
    { label: 'Sections share one vertical rhythm: the same top and bottom padding, 48px or more', test: (c) => { const [a, b] = Array.from(c.doc.querySelectorAll('.section')).map((el) => c.win.getComputedStyle(el)); return a.paddingTop === b.paddingTop && a.paddingBottom === b.paddingBottom && px(a.paddingTop) >= 48; } },
    { label: 'Cards have the same padding on all four sides', test: (c) => { const [t, r, b, l] = ['top', 'right', 'bottom', 'left'].map((s) => computed(c, '.card', `padding-${s}`)); return t === r && r === b && b === l; } },
    { label: 'Proximity: space inside a card < space between cards < space between sections', test: (c) => px(computed(c, '.card', 'row-gap')) > 0 && px(computed(c, '.card', 'row-gap')) < px(computed(c, '.cards', 'row-gap')) && px(computed(c, '.cards', 'row-gap')) < px(computed(c, '.section', 'padding-top')) },
    { label: 'Cards use one gap in both directions', test: (c) => computed(c, '.cards', 'row-gap') === computed(c, '.cards', 'column-gap') },
  ],
  hints: [
    'Decide the scale before touching a rule: 4, 8, 16, 24, 32, 48, 96 covers nearly everything. Define them as --space-1 to --space-7, then work through the file replacing every length.',
    'Default margins count too. h2 and p have browser margins that are not on the grid. Set them explicitly, or the check will find them.',
    'The card needs space between its heading and its text, but that gap must be smaller than the gap between cards. Make .card a flex column and give it a gap, instead of margins on the h3 and p.',
  ],
  realWorld: { label: 'MDN: custom properties. Compare section padding and card interiors on any well-built site', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
} satisfies LessonMeta;
