import type { LessonMeta } from '../../types';
import { all, text } from '../../helpers';

export default {
  title: 'Tables',
  minutes: 12,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'The table has the caption "Yearly advice fees"', test: ({ doc }) => text(doc.querySelector('table > caption')) === 'Yearly advice fees' },
    { label: 'A thead with three column headers (th)', test: ({ doc }) => all(doc, 'table thead th').length === 3 },
    { label: 'Header cells have scope="col"', test: ({ doc }) => { const th = all(doc, 'thead th'); return th.length > 0 && th.every((c) => c.getAttribute('scope') === 'col'); } },
    { label: 'Three service rows in tbody, three cells each', test: ({ doc }) => { const rows = all(doc, 'table tbody tr'); return rows.length >= 3 && rows.every((r) => r.querySelectorAll('td, th').length === 3); } },
  ],
  hints: [
    'Start with the outer frame: <table> <caption>...</caption> <thead>...</thead> <tbody>...</tbody> </table>',
    'Each row is <tr>, and each cell inside it is <td>. One row per service.',
  ],
} satisfies LessonMeta;
