import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Visual diffs',
  minutes: 40,
  kind: 'project',
  entry: 'diff.mjs',
  checkEntry: 'check.mjs',
  devPort: 4854,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'compareImages counts zero differences for identical images', test: ({ output }) => passed(output, 'identical images have no differences') },
    { label: 'It counts the changed pixels and the ratio of the whole picture', test: ({ output }) => passed(output, 'it counts changed pixels and the ratio') },
    { label: 'Tiny colour differences are ignored by the threshold', test: ({ output }) => passed(output, 'the threshold ignores tiny differences') },
    { label: 'Images of different sizes are reported, not crashed on', test: ({ output }) => passed(output, 'different sizes are reported') },
    { label: 'It returns a diff picture as a PNG', test: ({ output }) => passed(output, 'it returns a diff png') },
    { label: 'visual-diff.mjs says "changed" when the pages really differ', test: ({ output }) => passed(output, 'a real change is called changed') },
    { label: 'visual-diff.mjs says "same" for the same page, and for an invisible difference', test: ({ output }) => passed(output, 'no visible change is called same') },
    { label: 'It writes diff.png, and blocks tracking requests', test: ({ output }) => passed(output, 'it writes diff.png and blocks tracking') },
  ],
  hints: [
    'Decode both PNGs with PNG.sync.read(buffer). If their width or height differ, return { sizeMismatch: true } straight away. Otherwise make a PNG the same size to hold the output.',
    'pixelmatch(a.data, b.data, diff.data, width, height, { threshold }) returns the number of different pixels. The ratio is that number divided by width * height.',
    'In visual-diff.mjs, take the screenshots with { animations: "disabled", caret: "hide" } so the same page gives the same picture every time. The verdict is "changed" when the ratio is bigger than MAX_RATIO.',
  ],
} satisfies LessonMeta;
