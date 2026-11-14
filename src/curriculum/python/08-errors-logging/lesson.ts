import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Errors and logging',
  minutes: 20,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'parse_amount handles "4,400" and " $13,200 "', test: ({ output }) => passed(output, 'parse_amount') },
    { label: 'Text that isn\'t a number raises ValueError', test: ({ output }) => passed(output, 'parse_amount refuses text') },
    { label: 'Negative amounts raise ValueError', test: ({ output }) => passed(output, 'parse_amount refuses negatives') },
    { label: 'total_amounts skips the bad rows: 12100', test: ({ output }) => passed(output, 'total_amounts skips bad rows') },
    { label: 'One warning logged per bad row', test: ({ output }) => passed(output, 'total_amounts logs a warning per bad row') },
    { label: 'Warnings go through logging, not print', test: ({ output }) => passed(output, 'uses logging, not print, for warnings') },
  ],
  hints: [
    'int("abc") already raises ValueError. Catch it and raise your own with a clearer message.',
    'An empty string is a bad row too: int("") raises ValueError.',
  ],
} satisfies LessonMeta;
