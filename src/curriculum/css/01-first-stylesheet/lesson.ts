import type { LessonMeta } from '../../types';
import { computed, sheetLoaded } from '../../helpers';

export default {
  title: 'Your first stylesheet',
  minutes: 10,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'index.html links style.css and it loads', test: ({ doc }) => sheetLoaded(doc, 'style.css') },
    { label: 'body background is #0c1220', test: (c) => computed(c, 'body', 'background-color') === 'rgb(12, 18, 32)' },
    { label: 'body text colour is #e8e4da', test: (c) => computed(c, 'body', 'color') === 'rgb(232, 228, 218)' },
    { label: 'body font is system-ui', test: (c) => computed(c, 'body', 'font-family').startsWith('system-ui') },
    { label: 'The h1 is gold (#f2c38b)', test: (c) => computed(c, 'h1', 'color') === 'rgb(242, 195, 139)' },
  ],
  hints: [
    'Switch to the index.html tab and add <link rel="stylesheet" href="style.css"> on its own line just before </head>.',
    'In style.css: body { background-color: #0c1220; color: #e8e4da; font-family: system-ui, sans-serif; }',
    'Check for a missing semicolon or curly brace if a colour won\'t change. One typo can stop the rest of the rule.',
  ],
} satisfies LessonMeta;
