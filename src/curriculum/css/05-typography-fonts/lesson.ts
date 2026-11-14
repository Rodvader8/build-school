import type { LessonMeta } from '../../types';
import { computed, fontFaces, px, ruleValue } from '../../helpers';

const face = (doc: Document, family: string) =>
  fontFaces(doc).find((f) => f.style.getPropertyValue('font-family').replace(/["']/g, '').trim() === family);

const loaded = (doc: Document, family: string) =>
  Array.from(doc.fonts).some((f) => f.family.replace(/["']/g, '') === family && f.status === 'loaded');

export default {
  title: 'Typography and self-hosted fonts',
  minutes: 20,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: '@font-face for Instrument Serif, from a local .woff2', test: ({ doc }) => /fonts\/instrument-serif[^)]*\.woff2/.test(face(doc, 'Instrument Serif')?.style.getPropertyValue('src') ?? '') },
    { label: '@font-face for Geist, from a local .woff2', test: ({ doc }) => /fonts\/geist[^)]*\.woff2/.test(face(doc, 'Geist')?.style.getPropertyValue('src') ?? '') },
    { label: 'Both use font-display: swap', test: ({ doc }) => ['Instrument Serif', 'Geist'].every((f) => face(doc, f)?.style.getPropertyValue('font-display') === 'swap') },
    { label: 'Headings use Instrument Serif, and it actually loaded', test: (c) => computed(c, 'h1', 'font-family').replace(/"/g, '').startsWith('Instrument Serif') && computed(c, 'h2', 'font-family').replace(/"/g, '').startsWith('Instrument Serif') && loaded(c.doc, 'Instrument Serif') },
    { label: 'Body text uses Geist, and it actually loaded', test: (c) => computed(c, 'body', 'font-family').replace(/"/g, '').startsWith('Geist') && loaded(c.doc, 'Geist') },
    { label: 'Body line-height is 1.6', test: (c) => Math.abs(px(computed(c, '#services p', 'line-height')) / px(computed(c, '#services p', 'font-size')) - 1.6) < 0.05 },
    { label: 'The hero title uses clamp()', test: ({ doc }) => ruleValue(doc, '.nm-hero-title', 'font-size').startsWith('clamp(') },
    { label: 'The lede is limited in ch', test: ({ doc }) => /ch$/.test(ruleValue(doc, '.nm-lede', 'max-width')) },
  ],
  hints: [
    'The src path is relative to style.css, which sits next to the fonts folder: url(\'fonts/geist-latin-wght-normal.woff2\')',
    'Font names with spaces need quotes: \'Instrument Serif\'. Use exactly the same name in @font-face and in font-family.',
    'If the "actually loaded" check fails, the file path in src is wrong. Copy the file name from the Explorer.',
  ],
} satisfies LessonMeta;
