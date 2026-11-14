import type { LessonMeta } from '../../types';
import { all, computed, px, rulesInMedia } from '../../helpers';

const rect = (c: { doc: Document }, selector: string) => c.doc.querySelector(selector)!.getBoundingClientRect();

export default {
  title: 'Layout and the grid',
  minutes: 30,
  kind: 'web',
  entry: 'style.css',
  checks: [
    {
      label: 'Content sits in a centred column between 900px and 1140px wide',
      test: (c) => {
        const r = rect(c, '.services .wrap');
        return r.width >= 900 && r.width <= 1140 && Math.abs(r.left - (1200 - r.right)) <= 1;
      },
    },
    {
      label: 'The header holds the brand and nav on one row (flexbox)',
      test: (c) => {
        const b = rect(c, '.brand');
        const n = rect(c, '.nav');
        return n.left > b.right && n.top < b.bottom && n.bottom > b.top;
      },
    },
    { label: '.cards is a grid with three columns', test: (c) => computed(c, '.cards', 'display') === 'grid' && computed(c, '.cards', 'grid-template-columns').split(' ').length === 3 },
    { label: 'One gap value (16px or more) sets both rows and columns', test: (c) => px(computed(c, '.cards', 'row-gap')) >= 16 && computed(c, '.cards', 'row-gap') === computed(c, '.cards', 'column-gap') },
    {
      label: 'Cards line up: the wide card spans exactly two columns',
      test: (c) => {
        const cards = all(c.doc, '.card').map((el) => el.getBoundingClientRect());
        const gap = px(computed(c, '.cards', 'column-gap'));
        const narrow = cards[2].width;
        const lefts = new Set(cards.map((r) => Math.round(r.left)));
        return lefts.size === 3 && Math.abs(cards[1].width - narrow) < 1.5 && Math.abs(cards[0].width - (2 * narrow + gap)) < 1.5;
      },
    },
    { label: 'The page never scrolls sideways', test: ({ doc }) => doc.documentElement.scrollWidth <= doc.documentElement.clientWidth },
    {
      label: 'A max-width media query collapses .cards to one column',
      test: ({ doc }) => rulesInMedia(doc, /max-width/).some((r) => 'selectorText' in r && (r as CSSStyleRule).selectorText.includes('.cards') && (r as CSSStyleRule).style.getPropertyValue('grid-template-columns') !== ''),
    },
    { label: 'No inline styles', test: ({ doc, files }) => !doc.querySelector('[style]') && !/\sstyle\s*=/.test(files['index.html'] ?? '') },
  ],
  hints: [
    'Grid is for rows and columns together, flexbox for one line. The cards need grid-template-columns: repeat(3, 1fr) and one gap value. The header only needs display: flex with justify-content: space-between.',
    'The wide card is grid-column: span 2. At narrow widths it must go back to grid-column: auto, or it will create a phantom second column.',
    'A centred column is max-width plus margin-inline: auto. Put padding-inline on the same element, so text never touches the screen edge on a phone.',
  ],
  realWorld: { label: 'MDN: grid layout. Resize a well-built site and watch where the column edge and card rows go', href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids' },
} satisfies LessonMeta;
