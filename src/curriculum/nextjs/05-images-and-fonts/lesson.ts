import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Images and fonts',
  minutes: 45,
  kind: 'project',
  entry: 'app/layout.jsx',
  checkEntry: 'check.mjs',
  devPort: 4845,
  devCommand: 'npm run dev -- --port 4845 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the hero image has alt text, a width and height, and loads first',
    'the gallery images have dimensions and stay lazy',
    'the site builds',
    'the hero image is eager and preloaded, the others are lazy',
    'every image goes through next/image with alt, width and height',
    'fonts load with next/font/local from files in the repo',
    'the fonts are preloaded and swap in',
    'nothing is requested from Google',
    'headings use the display font through the theme',
    'there are no inline style props',
  ]),
  hints: [
    'Import Image from "next/image". It needs src, alt, width and height (the real pixel size, so the browser can reserve the space). Add sizes so the right file is chosen for the screen.',
    'In Next 16 the hero gets `preload` (the old `priority` prop is deprecated). Leave it off the gallery, so those images stay lazy.',
    'localFont({ src: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", display: "swap", variable: "--font-instrument" }), then put `${font.variable}` in the className of <html>. In the CSS, @theme inline { --font-display: var(--font-instrument); } makes the font-display class work.',
  ],
} satisfies LessonMeta;
