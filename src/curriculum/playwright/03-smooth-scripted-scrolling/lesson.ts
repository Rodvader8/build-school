import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Smooth scripted scrolling',
  minutes: 35,
  kind: 'project',
  entry: 'smooth-scroll.mjs',
  checkEntry: 'check.mjs',
  devPort: 4853,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'smooth-scroll.mjs loads and exports smoothScroll', test: ({ output }) => passed(output, 'smoothScroll loads') },
    { label: 'It is driven by requestAnimationFrame, not browser smooth-scrolling or sleeps', test: ({ output }) => passed(output, 'it uses requestAnimationFrame') },
    { label: 'It ends exactly on the target', test: ({ output }) => passed(output, 'it ends on the target') },
    { label: 'It takes about the time you asked for', test: ({ output }) => passed(output, 'it takes about the requested time') },
    { label: 'It moves a little on every frame (30 or more distinct positions)', test: ({ output }) => passed(output, 'it moves on every frame') },
    { label: 'It never goes backwards', test: ({ output }) => passed(output, 'it never goes backwards') },
    { label: 'It eases in: the start is slow', test: ({ output }) => passed(output, 'it eases in') },
    { label: 'It cruises: the middle is a steady speed', test: ({ output }) => passed(output, 'it cruises at a steady speed') },
    { label: 'It eases out: the end is slow', test: ({ output }) => passed(output, 'it eases out') },
  ],
  hints: [
    'Do the whole animation inside one page.evaluate. Read performance.now() when you start, and on every requestAnimationFrame work out t = elapsed / duration (a number from 0 to 1).',
    'Use the piecewise formula from the lesson: three branches for t < a, t < 1 - a, and the rest. Then window.scrollTo(0, from + (to - from) * progress(t)).',
    'Keep going while t < 1 by calling requestAnimationFrame(frame) again, and resolve the promise when t reaches 1. Clamp t with Math.min(..., 1) so you land exactly on the target.',
  ],
} satisfies LessonMeta;
