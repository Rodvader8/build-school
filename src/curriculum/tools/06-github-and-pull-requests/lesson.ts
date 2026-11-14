import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'GitHub and pull requests',
  minutes: 30,
  kind: 'terminal',
  entry: 'steps.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'origin.git exists and is a bare repository', test: ({ output }) => passed(output, 'origin.git is a bare repository') },
    { label: 'site is a repo with its own name and email', test: ({ output }) => passed(output, 'site is a repo with its own name and email') },
    { label: 'site\'s "origin" remote points at origin.git', test: ({ output }) => passed(output, 'site\'s origin remote points at origin.git') },
    { label: 'main on origin has the footer', test: ({ output }) => passed(output, 'main on origin has the footer') },
    { label: 'origin\'s main ends in a merge commit', test: ({ output }) => passed(output, 'origin\'s main ends in a merge commit') },
    { label: 'The footer commit and the merge both reached origin', test: ({ output }) => passed(output, 'the footer commit and the merge both reached origin') },
    { label: 'Your local main matches origin/main exactly', test: ({ output }) => passed(output, 'local main tracks origin/main and is up to date') },
    { label: 'origin never received .env', test: ({ output }) => passed(output, 'origin never received .env') },
    { label: '.env exists here but Git ignores it', test: ({ output }) => passed(output, '.env exists here but Git ignores it') },
  ],
  hints: [
    'Make origin.git from the lesson folder, before you cd into site. A bare repo has no files to edit. It only stores history.',
    '`git remote add origin ../origin.git` is relative to site, so the .. climbs back up to the lesson folder. git remote -v shows what you set.',
    'If a push says "no upstream branch", use -u the first time: git push -u origin add-footer.',
  ],
} satisfies LessonMeta;
