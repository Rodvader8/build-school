import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'LCP, CLS and TBT',
  minutes: 40,
  kind: 'project',
  entry: 'site/index.html',
  checkEntry: 'check.mjs',
  devPort: 4832,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The hero image isn\'t lazy-loaded and has high priority', test: ({ output }) => passed(output, 'the hero image has high priority and is not lazy') },
    { label: 'The hero image is preloaded', test: ({ output }) => passed(output, 'the hero image is preloaded') },
    { label: 'Every image has width and height attributes', test: ({ output }) => passed(output, 'every image has width and height') },
    { label: 'The widget script no longer blocks rendering', test: ({ output }) => passed(output, 'the widget script does not block rendering') },
    { label: 'Layout shift (CLS) in a real browser is under 0.05', test: ({ output }) => passed(output, 'layout shift is under 0.05') },
    { label: 'The widget still finishes its work', test: ({ output }) => passed(output, 'the widget still finishes') },
    { label: 'No long task blocks the page for more than 100ms in total', test: ({ output }) => passed(output, 'blocking time is under 100ms') },
    { label: 'Lighthouse: no unsized images and nothing render-blocking', test: ({ output }) => passed(output, 'lighthouse finds nothing to fix') },
  ],
  hints: [
    'For the hero: remove loading="lazy", add fetchpriority="high", and add <link rel="preload" as="image" href="/hero.jpg"> in the head. The one image people see first should be the first thing fetched.',
    'width="1600" height="800" are the image\'s real pixel size. The CSS (height: auto) still makes it fit the page. The browser uses the two numbers to reserve the right space before the file arrives.',
    'widget.js busy-waits for 400ms in one go. Do the same total work in 20ms slices and give the browser a turn between slices with setTimeout(step, 0).',
  ],
} satisfies LessonMeta;
