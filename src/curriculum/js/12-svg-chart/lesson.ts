import type { LessonMeta } from '../../types';
import { errors } from '../../helpers';

const AMOUNTS = [61000, 48000, 52000, 57000, 44000, 39000, 36000, 41000, 46000, 53000, 58000, 72000];
const bars = (doc: Document) => Array.from(doc.querySelectorAll('.db-chart rect'));
const num = (el: Element, a: string) => parseFloat(el.getAttribute(a) ?? 'NaN');

export default {
  title: 'An SVG chart by hand',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Twelve bars, made with createElementNS', test: ({ doc, files }) => bars(doc).length === 12 && /createElementNS/.test(files['script.js'] ?? '') },
    { label: 'November, the biggest month, is the tallest bar', test: ({ doc }) => { const h = bars(doc).map((b) => num(b, 'height')); return h.length === 12 && h[11] === Math.max(...h); } },
    { label: 'Heights are in proportion to the revenue', test: ({ doc }) => { const h = bars(doc).map((b) => num(b, 'height')); return h.length === 12 && AMOUNTS.every((a, i) => Math.abs(h[i] / h[11] - a / 72000) < 0.02); } },
    { label: 'Bars stand on the bottom edge (y + height = 240)', test: ({ doc }) => bars(doc).length === 12 && bars(doc).every((b) => Math.abs(num(b, 'y') + num(b, 'height') - 240) < 1) },
    { label: 'Bars run left to right without overlapping', test: ({ doc }) => { const b = bars(doc); return b.length === 12 && b.every((r, i) => i === 0 || num(r, 'x') >= num(b[i - 1], 'x') + num(b[i - 1], 'width')); } },
    { label: 'Each bar has a title like "Nov: $72,000"', test: ({ doc }) => bars(doc).length === 12 && bars(doc)[11].querySelector('title')?.textContent === 'Nov: $72,000' && bars(doc).every((b) => !!b.querySelector('title')) },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'setAttribute wants strings: bar.setAttribute(\'height\', String(height))',
    'x for bar i: i * slot + gap / 2, and width: slot - gap',
    'In the title, $ before ${ is just a dollar sign: `${r.month}: $${r.amount.toLocaleString(\'en-AU\')}`',
  ],
} satisfies LessonMeta;
