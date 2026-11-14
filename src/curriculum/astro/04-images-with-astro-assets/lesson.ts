import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Images with astro:assets',
  minutes: 35,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4814,
  devCommand: 'npm run dev -- --port 4814 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'The originals live in src/assets', test: ({ output }) => passed(output, 'the originals live in src/assets, not public') },
    { label: 'The hero is a <picture> with AVIF and WebP', test: ({ output }) => passed(output, 'the hero is a <picture> with AVIF and WebP sources') },
    { label: 'The hero offers at least three widths', test: ({ output }) => passed(output, 'the hero offers at least three widths') },
    { label: 'The hero has alt, width and height', test: ({ output }) => passed(output, 'the hero img has alt text, width and height') },
    { label: 'The hero loads eagerly, high priority', test: ({ output }) => passed(output, 'the hero loads eagerly with high priority') },
    { label: 'The oven photo is a lazy WebP', test: ({ output }) => passed(output, 'the oven photo is a lazy WebP with width and height') },
    { label: 'AVIF and WebP files were made', test: ({ output }) => passed(output, 'AVIF and WebP files were made at build time') },
    { label: 'Every generated image is lighter than the original', test: ({ output }) => passed(output, 'every generated image is smaller than the original JPG') },
    { label: 'No plain img still points at public', test: ({ output }) => passed(output, 'no plain <img> still points at a file in public') },
    { label: 'Every image has alt text', test: ({ output }) => passed(output, 'every image has alt text') },
    { label: 'og:image is an absolute JPG or PNG URL', test: ({ output }) => passed(output, 'og:image is an absolute JPG or PNG URL') },
    { label: 'The og:image file is a real JPEG', test: ({ output }) => passed(output, 'the og:image file really is a JPEG') },
  ],
  hints: [
    'Images in public are served exactly as they are. Images imported from src/assets are processed: import hero from \'../assets/hero.jpg\'; then <Picture src={hero} ... />.',
    'The hero is above the fold, so loading="eager" fetchpriority="high". Everything further down the page gets loading="lazy".',
    'const share = await getImage({ src: hero, format: \'jpg\', width: 1200, height: 630 }); then pass ogImage={share.src} to the layout.',
  ],
} satisfies LessonMeta;
