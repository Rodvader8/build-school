import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Debugging with a method',
  minutes: 45,
  kind: 'python',
  entry: 'BUGS.md',
  checkEntry: 'check.py',
  checks: outputChecks([
    'bug 1: top_paths(entries, 3) returns three pages',
    'bug 2: slowest() compares numbers, not text',
    'bug 3: error_paths() no longer remembers earlier calls',
    'your test_top_paths fails on the buggy code and passes on the fix',
    'your test_slowest fails on the buggy code and passes on the fix',
    'your test_error_paths fails on the buggy code and passes on the fix',
    "the team's existing tests still pass",
    'DEBUG_LOG.md has all five steps for all three bugs',
  ]),
  hints: [
    'Reproduce before anything else: python3 run_report.py shows all three bugs. Then shrink each one to the smallest call that goes wrong, such as top_paths(entries, 3) on its own in a scratch file.',
    'Print the evidence, don\'t stare at the code. For bug 2, print type(entry["ms"]). For bug 3, call error_paths twice and print both results. A guess you can\'t test is just a feeling.',
    'Write each regression test first and watch it fail against bugged.py (use assert with a message). Only then fix report.py and watch the same test pass. If a test passes on both, it proves nothing.',
  ],
} satisfies LessonMeta;
