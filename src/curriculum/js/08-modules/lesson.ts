import type { LessonMeta } from '../../types';
import { errors, globalValue, texts, waitFor } from '../../helpers';

export default {
  title: 'Modules: import and export',
  minutes: 15,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'main.js loads as a module', test: ({ doc }) => !!doc.querySelector('script[type="module"][src$="main.js"]') },
    { label: 'data.js exports rooms and formatRate', test: ({ files }) => /export\s+const\s+rooms/.test(files['data.js'] ?? '') && /export\s+(function\s+formatRate|const\s+formatRate)/.test(files['data.js'] ?? '') },
    { label: 'main.js imports them from ./data.js', test: ({ files }) => { const names = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/data\.js['"]/.exec(files['main.js'] ?? '')?.[1] ?? ''; return /\brooms\b/.test(names) && /\bformatRate\b/.test(names); } },
    { label: 'The list shows all three rooms', test: async ({ doc }) => (await waitFor(() => doc.querySelectorAll('.db-rooms li').length === 3)) && texts(doc, '.db-rooms li')[0] === 'Garden Room, $380 a night' },
    { label: 'rooms stays private to the modules (not a global)', test: ({ win }) => globalValue(win, 'rooms') === undefined },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Add the word export in front of const rooms and in front of function formatRate.',
    'First line of main.js: import { rooms, formatRate } from \'./data.js\';',
    'The ./ and the .js in the path both matter in a browser.',
  ],
} satisfies LessonMeta;
