import type { LessonMeta } from '../../types';
import { computed, fontFamilies, fontSizes, lineLengthCh, onScale, px } from '../../helpers';

const size = (c: Parameters<typeof computed>[0], sel: string) => px(computed(c, sel, 'font-size'));

export default {
  title: 'A type scale that holds together',
  minutes: 30,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Body text is between 16px and 18px', test: (c) => size(c, 'body') >= 16 && size(c, 'body') <= 18 },
    { label: 'Every font size on the page sits on a 1.25 scale from 16px (3% tolerance)', test: (c) => fontSizes(c).every((s) => onScale(s, 16, 1.25)) },
    { label: 'The page uses at least four steps of the scale', test: (c) => new Set(fontSizes(c).map((s) => Math.round(s))).size >= 4 },
    { label: 'Headings get smaller in order: h1, then h2, then h3, then body', test: (c) => size(c, 'h1') > size(c, 'h2') && size(c, 'h2') > size(c, 'h3') && size(c, 'h3') > size(c, 'body') },
    { label: 'Body copy uses a 1.5 to 1.7 line height; the h1 is 1.2 or tighter', test: (c) => { const lh = px(computed(c, 'p:not(.eyebrow)', 'line-height')) / size(c, 'p:not(.eyebrow)'); const hh = px(computed(c, 'h1', 'line-height')) / size(c, 'h1'); return lh >= 1.5 && lh <= 1.7 && hh <= 1.2; } },
    { label: 'The h1 has tight (negative) letter-spacing', test: (c) => px(computed(c, 'h1', 'letter-spacing')) < 0 },
    { label: 'Paragraphs run 45 to 75 characters per line', test: (c) => { const n = lineLengthCh(c, c.doc.querySelector('.page > p:nth-of-type(3)')!); return n >= 45 && n <= 75; } },
    { label: 'No more than two font families', test: (c) => fontFamilies(c).size <= 2 },
    { label: 'Sizes are defined as tokens: at least five --step custom properties on :root', test: ({ doc, win }) => { const s = win.getComputedStyle(doc.documentElement); return Array.from({ length: 6 }, (_, i) => s.getPropertyValue(`--step-${i}`).trim() || s.getPropertyValue(`--step--${i}`).trim()).filter(Boolean).length >= 5; } },
  ],
  hints: [
    'List the scale first: 16 x 1.25 gives 20, 25, 31.25 and 39.06 going up, and 12.8 going down. Every font-size in the file should be one of those, or a rem version of it (1.25rem is 20px).',
    'To fix the line length, cap the column, not the font: max-width: 68ch on the container puts paragraphs at about 68 characters per line.',
    'Count the families the page names. Pick one for headings and one for body (or just one for everything), and delete the rest, including the one on the eyebrow.',
  ],
  realWorld: { label: 'Type scale calculator: pick a base and a ratio and see the whole scale', href: 'https://typescale.com/' },
} satisfies LessonMeta;
