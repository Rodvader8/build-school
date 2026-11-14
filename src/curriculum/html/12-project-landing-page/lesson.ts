import type { LessonMeta } from '../../types';
import { all, controlsLabelled, fileHas, headingsInOrder, text } from '../../helpers';

export default {
  title: 'Project: a complete landing page',
  minutes: 45,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'Doctype, lang, charset and viewport', test: ({ doc, files }) => fileHas(files, 'index.html', /^\s*<!doctype html>/i) && !!doc.documentElement.lang && !!doc.querySelector('meta[charset]') && !!doc.querySelector('meta[name=viewport]') },
    { label: 'A title and a 120 to 160 character description', test: ({ doc }) => { const d = doc.querySelector('meta[name=description]')?.getAttribute('content')?.trim().length ?? 0; return text(doc.querySelector('title')).length >= 20 && d >= 120 && d <= 160; } },
    { label: 'An og:image (jpg or png)', test: ({ doc }) => /\.(jpe?g|png)$/i.test(doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '') },
    { label: 'header > nav with an aria-label and 3+ links', test: ({ doc }) => !!doc.querySelector('header nav[aria-label]') && all(doc, 'header nav a').length >= 3 },
    { label: 'Every nav link jumps to a section that exists', test: ({ doc }) => { const links = all(doc, 'nav a[href^="#"]'); return links.length >= 3 && links.every((a) => doc.getElementById(a.getAttribute('href')!.slice(1))?.tagName === 'SECTION'); } },
    { label: 'One main with exactly one h1', test: ({ doc }) => all(doc, 'main').length === 1 && all(doc, 'h1').length === 1 && !!doc.querySelector('main h1') },
    { label: 'Hero figure: image with alt, size and a caption', test: ({ doc }) => { const i = doc.querySelector('figure img'); return !!i && (i.getAttribute('alt') ?? '').length >= 10 && i.hasAttribute('width') && i.hasAttribute('height') && !!doc.querySelector('figure figcaption'); } },
    { label: 'Three or more sections, each with an id and an h2', test: ({ doc }) => all(doc, 'main section[id]').filter((s) => s.querySelector('h2')).length >= 3 },
    { label: 'A list of services or steps', test: ({ doc }) => all(doc, 'main ul > li, main ol > li').length >= 3 },
    { label: 'The fee table has a caption and column headers', test: ({ doc }) => !!doc.querySelector('table caption') && all(doc, 'table th[scope=col]').length >= 2 },
    { label: 'An enquiry form: labelled name and email, and a submit button', test: ({ doc }) => { const f = doc.querySelector('form'); return !!f && !!f.querySelector('input[type=email]') && controlsLabelled(f) && !!f.querySelector('button, input[type=submit]'); } },
    { label: 'Headings in order, and a footer', test: ({ doc }) => headingsInOrder(doc) && !!doc.querySelector('footer') },
  ],
  hints: [
    'Start with the skeleton from lesson 3, then add header, main and footer from lesson 7. Fill the sections in last.',
    'Each nav link\'s href (#fees) must match a section id (id="fees") exactly.',
    'Stuck on one check? Reopen the lesson that taught it from the curriculum list.',
  ],
} satisfies LessonMeta;
