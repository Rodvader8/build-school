import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Git: commit, branch, merge',
  minutes: 35,
  kind: 'terminal',
  entry: 'steps.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'site is a Git repository, on the main branch', test: ({ output }) => passed(output, 'site is a Git repository on main') },
    { label: 'This repo has its own name and email (not the global ones)', test: ({ output }) => passed(output, 'this repo has its own name and email') },
    { label: 'The nav-links branch exists and has been merged', test: ({ output }) => passed(output, 'the nav-links branch exists and is merged') },
    { label: 'main ends in a real merge commit', test: ({ output }) => passed(output, 'main has a real merge commit') },
    { label: 'The merged page has the nav', test: ({ output }) => passed(output, 'the merged page has the nav') },
    { label: 'The colour change made on main survived the merge', test: ({ output }) => passed(output, 'the colour change on main survived the merge') },
    { label: 'Nothing is left uncommitted', test: ({ output }) => passed(output, 'nothing is left uncommitted') },
    { label: '.env is ignored by Git, and .env.example isn\'t', test: ({ output }) => passed(output, '.env is ignored by Git') },
    { label: '.env.example and .gitignore are committed', test: ({ output }) => passed(output, '.env.example and .gitignore are committed') },
    { label: '.env was never committed, on any branch', test: ({ output }) => passed(output, '.env was never committed, on any branch') },
  ],
  hints: [
    'You have to be inside the site folder for Git commands: cd site. Then git status tells you where you are and what has changed.',
    'Write .gitignore before your first git add. If .env is listed as untracked in git status, the .gitignore isn\'t working yet.',
    'The nav goes where the <!-- nav goes here --> comment is. Switch back to main before you change style.css, otherwise the colour change lands on the wrong branch.',
  ],
} satisfies LessonMeta;
