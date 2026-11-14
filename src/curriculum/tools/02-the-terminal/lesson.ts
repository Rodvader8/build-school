import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'The terminal: cd, ls, mkdir',
  minutes: 25,
  kind: 'terminal',
  entry: 'tasks.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'archive/2026/reports exists', test: ({ output }) => passed(output, 'archive/2026/reports exists') },
    { label: 'The two reports were copied (and the originals are still in inbox)', test: ({ output }) => passed(output, 'the reports were copied, not moved') },
    { label: 'The copies kept their contents', test: ({ output }) => passed(output, 'the copied reports kept their contents') },
    { label: 'Both screenshots were moved into images', test: ({ output }) => passed(output, 'both screenshots were moved into images') },
    { label: 'notes.txt was renamed to meeting-notes.txt', test: ({ output }) => passed(output, 'notes.txt was renamed') },
    { label: 'The .tmp files are gone', test: ({ output }) => passed(output, 'the .tmp files are gone') },
    { label: 'keep-me.txt survived', test: ({ output }) => passed(output, 'keep-me.txt is still there') },
  ],
  hints: [
    'mkdir -p makes every missing folder along the way. Without -p, mkdir archive/2026/reports fails because archive doesn\'t exist yet.',
    'A glob like inbox/shot-*.png expands to both screenshots before the command runs. Run ls inbox/shot-*.png first to see what it matches.',
    'mv is also how you rename: mv inbox/notes.txt inbox/meeting-notes.txt. The terminal here starts in this lesson\'s folder, so you shouldn\'t need cd for this one.',
  ],
} satisfies LessonMeta;
