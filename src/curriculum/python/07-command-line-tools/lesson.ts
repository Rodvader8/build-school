import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Command-line tools with argparse',
  minutes: 20,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'Uses argparse', test: ({ output }) => passed(output, 'uses argparse') },
    { label: 'python3 main.py 4400 prints $4,400', test: ({ output }) => passed(output, 'amount only') },
    { label: '--gst adds 10%: $4,840', test: ({ output }) => passed(output, '--gst') },
    { label: '--nights 3 at 520: $1,560', test: ({ output }) => passed(output, '--nights') },
    { label: 'Both together: $1,716', test: ({ output }) => passed(output, '--nights and --gst') },
    { label: '--help explains the options', test: ({ output }) => passed(output, '--help') },
    { label: 'A non-number amount is refused', test: ({ output }) => passed(output, 'bad amount is refused') },
  ],
  hints: [
    'type=int on the rate argument makes argparse refuse "lots" for you.',
    'Print only the total. The checker compares the output exactly.',
  ],
} satisfies LessonMeta;
