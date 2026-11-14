import type { LessonMeta } from '../../types';
import { all, computed, contrastRatio, errors, fileHas, text, waitFor } from '../../helpers';

export default {
  title: 'Chrome DevTools',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The page asks for results.json at the right address', test: ({ files }) => fileHas(files, 'script.js', /fetch\(\s*['"]results\.json['"]\s*\)/) },
    { label: 'Four site cards appear', test: ({ doc }) => waitFor(() => all(doc, '.card').length === 4) },
    { label: 'The summary line says "3 of 4 sites score 90 or more"', test: async ({ doc }) => (await waitFor(() => /3 of 4/.test(text(doc.querySelector('#summary'))))) },
    { label: 'The scores are readable (not hidden against the card)', test: (c) => contrastRatio(computed(c, '.score', 'color'), computed(c, '.card', 'background-color')) >= 4.5 },
    { label: 'No errors in the console', test: async ({ win }) => (await waitFor(() => errors(win).length === 0, 300)) && errors(win).length === 0 },
  ],
  hints: [
    'Open the preview in its own tab (the address is in the lesson). Press F12, then click the Network tab and reload with Ctrl+F5. A red row is a failed request.',
    'The Console tab names the line the error came from. "Cannot set properties of null" almost always means getElementById found nothing: check the spelling against index.html.',
    'Click the score number with the Elements picker (Ctrl+Shift+C). In the Styles pane, a rule with a line through it lost, and the one that won is listed above it.',
  ],
} satisfies LessonMeta;
