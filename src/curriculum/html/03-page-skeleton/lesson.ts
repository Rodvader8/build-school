import type { LessonMeta } from '../../types';
import { fileHas, text } from '../../helpers';

export default {
  title: 'The page skeleton',
  minutes: 10,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'Starts with <!doctype html>', test: ({ files }) => fileHas(files, 'index.html', /^\s*<!doctype html>/i) },
    { label: 'Has <html>, <head> and <body> tags', test: ({ files }) => ['<html', '<head', '<body'].every((t) => (files['index.html'] ?? '').toLowerCase().includes(t)) },
    { label: 'html has lang="en-AU"', test: ({ doc }) => doc.documentElement.getAttribute('lang')?.toLowerCase() === 'en-au' },
    { label: 'meta charset is utf-8', test: ({ doc }) => doc.querySelector('meta[charset]')?.getAttribute('charset')?.toLowerCase() === 'utf-8' },
    { label: 'Has the viewport meta tag', test: ({ doc }) => /width=device-width/.test(doc.querySelector('meta[name=viewport]')?.getAttribute('content') ?? '') },
    { label: 'The title is "Larkfield Private Wealth"', test: ({ doc }) => text(doc.querySelector('title')) === 'Larkfield Private Wealth' },
    { label: 'The h1 is inside the body', test: ({ doc }) => !!doc.body.querySelector('h1') },
  ],
  hints: [
    'Copy the skeleton from the lesson, then move your h1 between <body> and </body>.',
    'The title goes inside the head: <title>Larkfield Private Wealth</title>',
    'The browser fixes a missing <head> silently, which is why one check reads your file instead of the page.',
  ],
} satisfies LessonMeta;
