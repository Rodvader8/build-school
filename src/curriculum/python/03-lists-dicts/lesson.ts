import type { LessonMeta } from '../../types';
import { outputLines } from '../../helpers';

export default {
  title: 'Lists and dictionaries',
  minutes: 15,
  kind: 'python',
  entry: 'main.py',
  checks: [
    { label: 'Three rooms: printed 3, Garden Room, Cliff Suite', test: ({ output }) => { const l = outputLines(output); const i = l.indexOf('3'); return i >= 0 && l[i + 1] === 'Garden Room' && l[i + 2] === 'Cliff Suite'; } },
    { label: 'Used append and a negative index', test: ({ files }) => /rooms\.append\(/.test(files['main.py'] ?? '') && /rooms\[-1\]/.test(files['main.py'] ?? '') },
    { label: 'The Ocean Room rate: 520', test: ({ output }) => outputLines(output).includes('520') },
    { label: 'The updated rates dict', test: ({ output }) => outputLines(output).includes("{'Garden Room': 400, 'Ocean Room': 520, 'Cliff Suite': 760}") },
    { label: 'M. Okafor owes $1,560, worked out from the dicts', test: ({ output, files }) => outputLines(output).includes('M. Okafor owes $1,560') && /rates\[\s*booking\[/.test(files['main.py'] ?? '') },
    { label: 'No errors', test: ({ output }) => !/Traceback/.test(output) },
  ],
  hints: [
    'Inside an f-string, use the other kind of quotes for keys: f"{booking[\'guest\']}"',
    'The total: booking["nights"] * rates[booking["room"]]',
  ],
} satisfies LessonMeta;
