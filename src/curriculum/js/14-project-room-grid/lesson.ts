import type { LessonMeta } from '../../types';
import { all, errors, fire, text } from '../../helpers';

const cells = (doc: Document) => all(doc, '.tw-grid .tw-cell');
const cell = (doc: Document, room: number, night: number) => cells(doc)[room * 14 + night] as HTMLButtonElement | undefined;
const summary = (doc: Document) => [text(doc.querySelector('.tw-nights')), text(doc.querySelector('.tw-total'))].join(' ');

export default {
  title: 'Project: the Brightwater room grid',
  minutes: 60,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: '42 cells (3 rooms x 14 nights), built from the data', test: ({ doc, files }) => cells(doc).length === 42 && !/tw-cell/.test(files['index.html'] ?? '') },
    { label: 'Cells are buttons with an aria-label', test: ({ doc }) => cells(doc).length === 42 && cells(doc).every((c) => c.tagName === 'BUTTON' && (c.getAttribute('aria-label') ?? '').length > 5) },
    { label: 'Room names label each row', test: ({ doc }) => ['Garden Room', 'Ocean Room', 'Cliff Suite'].every((n) => text(doc.querySelector('.tw-grid')).includes(n)) },
    { label: 'The 14 booked nights are marked and disabled', test: ({ doc }) => { const b = cells(doc).filter((c) => c.classList.contains('is-booked')); return b.length === 14 && b.every((c) => (c as HTMLButtonElement).disabled) && !!cell(doc, 0, 2)?.classList.contains('is-booked'); } },
    { label: 'Clicking a free Garden night selects it: 1 night, $380', test: (c) => { const g = cell(c.doc, 0, 0); fire(c, g ?? null, 'click'); return !!g?.classList.contains('is-selected') && g.getAttribute('aria-pressed') === 'true' && summary(c.doc) === '1 $380'; } },
    { label: 'Adding a free Ocean night: 2 nights, $900', test: (c) => { fire(c, cell(c.doc, 1, 2) ?? null, 'click'); return summary(c.doc) === '2 $900'; } },
    { label: 'Clicking the Garden night again removes it: 1 night, $520', test: (c) => { const g = cell(c.doc, 0, 0); fire(c, g ?? null, 'click'); return !g?.classList.contains('is-selected') && g?.getAttribute('aria-pressed') === 'false' && summary(c.doc) === '1 $520'; } },
    { label: 'A booked night can\'t be chosen', test: (c) => { fire(c, cell(c.doc, 2, 5) ?? null, 'click'); return summary(c.doc) === '1 $520' && !cell(c.doc, 2, 5)?.classList.contains('is-selected'); } },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Two loops: rooms.forEach((room, r) => { ... }) and inside it for (let night = 0; night < NIGHTS; night++) { ... }',
    'room.booked.includes(night) tells you whether a night is taken.',
    'Keep the selection in a Set of strings like `${r}:${night}`, and recalculate the summary from it after every click.',
  ],
} satisfies LessonMeta;
