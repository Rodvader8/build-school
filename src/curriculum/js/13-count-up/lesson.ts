import type { LessonMeta } from '../../types';
import { errors, texts, waitFor } from '../../helpers';

export default {
  title: 'Count-ups with IntersectionObserver',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Nothing counts before you scroll there', test: async ({ doc }) => { await new Promise((r) => setTimeout(r, 300)); return texts(doc, '.db-stat').every((t) => t === '0'); } },
    {
      label: 'Scrolled into view, they count up to 184, 1,284 and 97',
      test: async ({ doc }) => {
        doc.querySelector('.db-results')?.scrollIntoView({ block: 'center' });
        return waitFor(() => JSON.stringify(texts(doc, '.db-stat')) === '["184","1,284","97"]', 4000);
      },
    },
    { label: 'Uses IntersectionObserver and requestAnimationFrame', test: ({ files }) => /new\s+IntersectionObserver/.test(files['script.js'] ?? '') && /requestAnimationFrame/.test(files['script.js'] ?? '') },
    { label: 'Each stat counts only once (unobserve)', test: ({ files }) => /unobserve\(/.test(files['script.js'] ?? '') },
    { label: 'Reduced motion is respected', test: ({ files }) => /prefers-reduced-motion/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'performance.now() gives the current time in milliseconds. Save it as start when the count begins.',
    'Make sure the last frame shows the exact target: t is capped at 1, so target * easeOut(1) is the target.',
  ],
} satisfies LessonMeta;
