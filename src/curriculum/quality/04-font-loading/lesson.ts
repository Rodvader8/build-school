import type { LessonMeta } from '../../types';
import { all, computed, fileHas, fontFaces } from '../../helpers';

const face = (doc: Document, family: string) =>
  fontFaces(doc).find((f) => f.style.getPropertyValue('font-family').replace(/["']/g, '').trim() === family);

const loaded = (doc: Document, family: string) =>
  Array.from(doc.fonts).some((f) => f.family.replace(/["']/g, '') === family && f.status === 'loaded');

const preloads = (doc: Document) => all(doc, 'link[rel="preload"][as="font"]');

export default {
  title: 'Font loading',
  minutes: 25,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'No @import in the CSS and nothing fetched from Google Fonts', test: ({ files }) => !fileHas(files, 'style.css', /@import/) && !fileHas(files, 'index.html', /fonts\.(googleapis|gstatic)\.com/) },
    { label: '@font-face for Instrument Serif and Geist, from local .woff2 files', test: ({ doc }) => ['Instrument Serif', 'Geist'].every((f) => /fonts\/[^)]*\.woff2/.test(face(doc, f)?.style.getPropertyValue('src') ?? '')) },
    { label: 'Both faces use font-display: swap', test: ({ doc }) => ['Instrument Serif', 'Geist'].every((f) => face(doc, f)?.style.getPropertyValue('font-display') === 'swap') },
    { label: 'Both fonts are used and actually loaded', test: (c) => computed(c, 'h1', 'font-family').replace(/"/g, '').startsWith('Instrument Serif') && computed(c, 'body', 'font-family').replace(/"/g, '').startsWith('Geist') && loaded(c.doc, 'Instrument Serif') && loaded(c.doc, 'Geist') },
    { label: 'Each font stack ends with a fallback family', test: (c) => /(serif|sans-serif|system-ui)\s*$/.test(computed(c, 'h1', 'font-family')) && /(serif|sans-serif|system-ui)\s*$/.test(computed(c, 'body', 'font-family')) },
    { label: 'Exactly one font is preloaded, with as="font", type and crossorigin', test: ({ doc }) => preloads(doc).length === 1 && preloads(doc)[0].getAttribute('type') === 'font/woff2' && preloads(doc)[0].hasAttribute('crossorigin') },
    { label: 'The preloaded font is the one the headline uses', test: (c) => { const href = preloads(c.doc)[0]?.getAttribute('href') ?? ''; const src = face(c.doc, 'Instrument Serif')?.style.getPropertyValue('src') ?? ''; return href !== '' && src.includes(href.replace(/^\.?\//, '')); } },
  ],
  hints: [
    'Delete the @import line, then write one @font-face per family: font-family, src: url(\'fonts/....woff2\') format(\'woff2\'), and font-display: swap. The files are in the fonts folder.',
    'The preload goes in the <head> of index.html: <link rel="preload" href="fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>. Fonts need crossorigin even when they come from your own site.',
    'Preload only the font the headline uses. Preloading everything makes the browser fetch a lot early and delays the things that matter more.',
  ],
} satisfies LessonMeta;
