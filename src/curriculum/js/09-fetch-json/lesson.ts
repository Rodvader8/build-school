import type { LessonMeta } from '../../types';
import { errors, text, texts, waitFor } from '../../helpers';

export default {
  title: 'fetch and JSON',
  minutes: 20,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'bookings.json is fetched with await', test: ({ files }) => /await\s+fetch\(\s*['"`]bookings\.json/.test(files['script.js'] ?? '') && /await\s+\w+\.json\(\)/.test(files['script.js'] ?? '') },
    { label: 'All four arrivals appear', test: async ({ doc }) => waitFor(() => doc.querySelectorAll('.db-arrivals li').length === 4) },
    { label: 'Each reads guest, room, nights', test: ({ doc }) => texts(doc, '.db-arrivals li')[0] === 'M. Okafor, Ocean Room, 3 nights' },
    { label: 'One night says "night", not "nights"', test: ({ doc }) => texts(doc, '.db-arrivals li')[3] === 'R. Patel, Ocean Room, 1 night' },
    { label: 'The status says 4 arrivals today', test: ({ doc }) => text(doc.querySelector('.db-status')) === '4 arrivals today' },
    { label: 'Failures are handled with try, catch and response.ok', test: ({ files }) => /try\s*\{/.test(files['script.js'] ?? '') && /catch\s*\(/.test(files['script.js'] ?? '') && /\.ok\b/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'A ternary picks between two values: arrival.nights === 1 ? \'night\' : \'nights\'',
    'Everything that uses the data goes inside the try, after the await lines.',
  ],
} satisfies LessonMeta;
