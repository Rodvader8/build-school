import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Image pipelines with sharp',
  minutes: 40,
  kind: 'project',
  entry: 'build-images.mjs',
  checkEntry: 'check.mjs',
  devPort: 4833,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The script runs without errors', test: ({ output }) => passed(output, 'build-images.mjs runs') },
    { label: 'Widths 480, 960 and 1600 each exist as AVIF, WebP and JPG', test: ({ output }) => passed(output, 'three widths in three formats') },
    { label: 'Nothing is bigger than the original (no upscaling)', test: ({ output }) => passed(output, 'nothing is upscaled') },
    { label: 'AVIF and WebP are smaller than the JPG at every width', test: ({ output }) => passed(output, 'modern formats are smaller') },
    { label: 'Location and camera data is stripped from every file', test: ({ output }) => passed(output, 'metadata is stripped') },
    { label: 'The social image is a 1200 by 630 JPG', test: ({ output }) => passed(output, 'the social image is a 1200x630 jpg') },
    { label: 'The page\'s og:image points at that JPG, not a WebP', test: ({ output }) => passed(output, 'og:image is a jpg or png') },
    { label: 'snippet.html is a <picture> with AVIF, WebP and JPG sources and a sizes attribute', test: ({ output }) => passed(output, 'snippet.html is a proper picture element') },
  ],
  hints: [
    'Make one function that gives you a fresh sharp(SOURCE).resize({ width }) for each width, then call .avif(), .webp() and .jpeg() on it. Each output needs its own pipeline.',
    'Skip any width bigger than the original: WIDTHS.filter((w) => w <= sourceWidth). Upscaling makes bigger files that look no better.',
    'sharp strips metadata unless you ask it not to. Remove .withMetadata() and the camera and location data goes with it. For the social image use resize(1200, 630, { fit: "cover" }).jpeg().',
  ],
} satisfies LessonMeta;
