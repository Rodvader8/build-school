import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Packages and virtual environments',
  minutes: 20,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  testSetup: 'python3 -m venv .venv && .venv/bin/pip install --quiet -r requirements.txt',
  checks: [
    { label: 'Running inside a virtual environment', test: ({ output }) => passed(output, 'in a venv') },
    { label: 'It\'s this lesson\'s own .venv', test: ({ output }) => passed(output, 'the venv is this lesson\'s .venv') },
    { label: 'humanize is installed in it', test: ({ output }) => passed(output, 'humanize installed') },
    { label: 'requirements.txt pins the exact version', test: ({ output }) => passed(output, 'requirements.txt pins it') },
    { label: 'main.py prints 1,284,000 and 1.5 MB', test: ({ output }) => passed(output, 'main.py uses it') },
  ],
  hints: [
    'Run the three commands one at a time in the terminal prompt, waiting for each to finish.',
    'If requirements.txt doesn\'t appear in the Explorer, check you typed the > in the freeze command.',
  ],
} satisfies LessonMeta;
