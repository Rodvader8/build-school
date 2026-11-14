import type { LessonMeta } from '../../types';
import { gateChecks } from '../../helpers';

export default {
  title: 'Brief 1: a motion-led landing page',
  minutes: 150,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4882,
  devCommand: 'npm run dev -- --port 4882 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: gateChecks([
    'the page says what the data file says',
    'no copy is typed into the page template',
    'the four sections are there',
    'every speaker has its specs in a description list',
    'every image has useful alt text, and only the hero loads eagerly',
    'the motion is GSAP with ScrollTrigger, bundled from npm',
    'the copy avoids hype words',
    'there is a way to book: an email link and a phone link',
  ]),
  hints: ['Read BRIEF.md, then run the gate.'],
} satisfies LessonMeta;
