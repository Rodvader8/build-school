import type { LessonMeta } from '../../types';
import { outputLines } from '../../helpers';

export default {
  title: 'Variables, strings and f-strings',
  minutes: 12,
  kind: 'python',
  entry: 'main.py',
  stdin: 'Sam\n',
  checks: [
    { label: 'input() asks for a name and you greet it: G\'day, Sam!', test: ({ output }) => output.includes("G'day, Sam!") },
    { label: 'Larkfield Private Wealth looks after 121 families.', test: ({ output }) => outputLines(output).includes('Larkfield Private Wealth looks after 121 families.') },
    { label: 'The Private plan is $13,200 a year.', test: ({ output }) => outputLines(output).includes('The Private plan is $13,200 a year.') },
    { label: 'Uses f-strings, and :, for the commas', test: ({ files }) => /f["']/.test(files['main.py'] ?? '') && /:,\}/.test(files['main.py'] ?? '') },
    { label: 'The firm name in capitals', test: ({ output }) => outputLines(output).includes('LARKFIELD PRIVATE WEALTH') },
    { label: 'No errors', test: ({ output }) => !/Traceback/.test(output) },
  ],
  hints: [
    'The $ is just a character inside the f-string: f"The Private plan is ${fee:,} a year."',
    'Mind the full stops at the end of the sentences. The checker compares them exactly.',
  ],
} satisfies LessonMeta;
