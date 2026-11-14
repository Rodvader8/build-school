import type { LessonMeta } from '../../types';
import { outputLines } from '../../helpers';

export default {
  title: 'Hello, Python',
  minutes: 8,
  kind: 'python',
  entry: 'main.py',
  checks: [
    { label: 'You printed a greeting', test: ({ output }) => outputLines(output).some((l) => /[a-z]{3,}/i.test(l) && !/Error|Traceback/.test(l)) },
    { label: 'You printed the total: 25300', test: ({ output }) => outputLines(output).includes('25300') },
    { label: 'You printed the monthly cost: 1100.0', test: ({ output }) => outputLines(output).includes('1100.0') },
    { label: 'No errors', test: ({ output }) => !/Traceback|Error/.test(output) },
  ],
  hints: ['print("Hello from Python") prints text. print(4400 + 7700 + 13200) prints the sum. No quotes around maths.'],
} satisfies LessonMeta;
