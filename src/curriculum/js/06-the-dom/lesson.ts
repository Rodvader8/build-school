import type { LessonMeta } from '../../types';
import { all, errors, text, texts } from '../../helpers';

export default {
  title: 'The DOM: data into a table',
  minutes: 20,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'The table has four rows, built by your script', test: ({ doc, files }) => all(doc, '.db-fees tr').length === 4 && !/<tr/i.test((files['index.html'] ?? '').split('<tbody')[1]?.split('</tbody>')[0] ?? '') },
    { label: 'Each row has three cells', test: ({ doc }) => all(doc, '.db-fees tr').length > 0 && all(doc, '.db-fees tr').every((r) => r.querySelectorAll('td').length === 3) },
    { label: 'Row one reads Foundation, Just starting out, $2,200', test: ({ doc }) => JSON.stringify(texts(doc, '.db-fees tr:first-child td')) === JSON.stringify(['Foundation', 'Just starting out', '$2,200']) },
    { label: 'The last row shows $13,200', test: ({ doc }) => texts(doc, '.db-fees tr:last-child td')[2] === '$13,200' },
    { label: 'The count says 4 plans', test: ({ doc }) => text(doc.querySelector('.db-count')) === '4 plans' },
    { label: 'textContent, not innerHTML', test: ({ files }) => !/innerHTML/.test(files['script.js'] ?? '') && /textContent/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Inside the loop: const row = document.createElement(\'tr\'); then make three td elements and append each one to row.',
    'A neat trick: loop over [plan.name, plan.suits, formatFee(plan.fee)] to make the three cells.',
    'Append the row to the tbody inside the loop, or nothing shows.',
  ],
} satisfies LessonMeta;
