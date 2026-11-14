import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Files: CSV in, JSON out',
  minutes: 25,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'read_bookings reads all 6 rows', test: ({ output }) => passed(output, 'read_bookings') },
    { label: 'nights and rate are numbers, not strings', test: ({ output }) => passed(output, 'numbers are numbers') },
    { label: 'summarise gets the totals and the per-room revenue right', test: ({ output }) => passed(output, 'summarise') },
    { label: 'main() writes summary.json', test: ({ output }) => passed(output, 'main writes summary.json') },
    { label: 'Files are opened safely (with open, or pathlib)', test: ({ output }) => passed(output, 'uses with open or pathlib') },
  ],
  hints: [
    'If revenue comes out as a long string of digits, nights and rate are still strings: "3" * ... repeats text!',
    'by_room.get(room, 0) returns 0 when the room isn\'t in the dict yet.',
  ],
} satisfies LessonMeta;
