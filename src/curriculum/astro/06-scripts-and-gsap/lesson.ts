import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Scripts per page, and GSAP from npm',
  minutes: 35,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4816,
  devCommand: 'npm run dev -- --port 4816 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'gsap is a dependency in package.json', test: ({ output }) => passed(output, 'gsap is a dependency in package.json') },
    { label: 'No script is loaded from a CDN', test: ({ output }) => passed(output, 'no script is loaded from a CDN') },
    { label: 'Your animation code lives in src/scripts', test: ({ output }) => passed(output, 'your animation code lives in src/scripts') },
    { label: 'The home page loads a bundled module', test: ({ output }) => passed(output, 'the home page loads its script as a bundled module') },
    { label: 'GSAP is bundled into the built script', test: ({ output }) => passed(output, 'GSAP is bundled into the built script') },
    { label: 'The about page ships no scripts', test: ({ output }) => passed(output, 'the about page ships no scripts') },
    { label: 'The animation respects prefers-reduced-motion', test: ({ output }) => passed(output, 'the animation checks prefers-reduced-motion') },
    { label: 'Content is visible without JavaScript', test: ({ output }) => passed(output, 'the cards are visible without JavaScript') },
    { label: 'No inline style attributes', test: ({ output }) => passed(output, 'no inline style attributes') },
  ],
  hints: [
    'npm install gsap adds it to package.json for you. Then, in a script file, import gsap from \'gsap\'; works like any other import.',
    'In an .astro page, a plain <script> tag is bundled by Astro. Put import \'../scripts/home.js\'; inside it. Adding is:inline would skip the bundler, so leave that off.',
    'window.matchMedia(\'(prefers-reduced-motion: reduce)\').matches is true for visitors who asked their device for less motion. Wrap the gsap call in if (!reduceMotion) { ... }.',
  ],
} satisfies LessonMeta;
