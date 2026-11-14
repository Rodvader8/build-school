import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Finding a regression with git bisect',
  minutes: 35,
  kind: 'terminal',
  entry: 'steps.txt',
  checkEntry: 'check.py',
  testSetup: 'bash setup.sh && if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'app/ is a repository with its own name and email', test: ({ output }) => passed(output, 'app/ is a repository with its own name and email') },
    { label: 'The history is intact: the tag and the guilty commit are still there', test: ({ output }) => passed(output, 'the history is intact: the tag and the guilty commit are still there') },
    { label: 'bisect.log shows a bisect that narrowed down to a first bad commit', test: ({ output }) => passed(output, 'bisect.log shows a bisect that narrowed down to a first bad commit') },
    { label: 'answer.txt names the first bad commit', test: ({ output }) => passed(output, 'answer.txt names the first bad commit') },
    { label: 'The bisect is finished and you\'re back on main', test: ({ output }) => passed(output, 'the bisect is finished: git bisect reset was run, and you\'re back on main') },
    { label: 'The tests pass at the tip of main', test: ({ output }) => passed(output, 'the tests pass at the tip of main') },
    { label: 'The fix is a new commit on top of the old history', test: ({ output }) => passed(output, 'the fix is a new commit on top of the old history') },
    { label: 'Nothing is left uncommitted', test: ({ output }) => passed(output, 'nothing is left uncommitted') },
  ],
  hints: [
    'Run bash setup.sh first, from the lesson folder (not inside app). It builds the repo. Then cd app. The release tag v1.0 is your known good commit.',
    'git bisect run takes a command that exits 0 for good and non-zero for bad. test_slugify.py already does exactly that, so: git bisect run python3 test_slugify.py',
    'Git prints "<hash> is the first bad commit". Paste that hash into answer.txt with: echo <hash> > ../answer.txt. Run git bisect reset before you fix anything, or you\'ll be fixing a detached HEAD.',
  ],
} satisfies LessonMeta;
