import type { LessonMeta } from '../../types';
import { outputLines } from '../../helpers';

export default {
  title: 'Loops and conditions',
  minutes: 15,
  kind: 'python',
  entry: 'main.py',
  checks: [
    { label: 'M. Okafor: $1,560 (short stay)', test: ({ output }) => outputLines(output).includes('M. Okafor: $1,560 (short stay)') },
    { label: 'A. Nguyen: $3,800 (long stay)', test: ({ output }) => outputLines(output).includes('A. Nguyen: $3,800 (long stay)') },
    { label: 'R. Patel: $520 (one night)', test: ({ output }) => outputLines(output).includes('R. Patel: $520 (one night)') },
    { label: 'Total: $6,640', test: ({ output }) => outputLines(output).includes('Total: $6,640') },
    { label: 'Ocean Room guests, from a list comprehension', test: ({ output, files }) => outputLines(output).includes("['M. Okafor', 'R. Patel']") && /\[.*\bfor\s+\w+\s+in\s+bookings\b.*\]/.test(files['main.py'] ?? '') },
    { label: 'No errors', test: ({ output }) => !/Traceback/.test(output) },
  ],
  hints: [
    'Check for 5 or more first, then exactly 1, then everything else.',
    'total = 0 goes before the loop, and total += amount goes inside it.',
  ],
} satisfies LessonMeta;
