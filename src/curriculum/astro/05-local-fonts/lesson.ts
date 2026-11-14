import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Local fonts with fontProviders.local',
  minutes: 30,
  kind: 'project',
  entry: 'astro.config.mjs',
  checkEntry: 'check.mjs',
  devPort: 4815,
  devCommand: 'npm run dev -- --port 4815 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'The config declares fonts with fontProviders.local()', test: ({ output }) => passed(output, 'the config declares fonts with fontProviders.local()') },
    { label: 'Both families have an @font-face', test: ({ output }) => passed(output, 'both families have an @font-face in the built page') },
    { label: 'Every @font-face file is a local woff2', test: ({ output }) => passed(output, 'every @font-face file is a local woff2') },
    { label: 'The woff2 files are in dist', test: ({ output }) => passed(output, 'the woff2 files are in dist and are real fonts') },
    { label: 'Nothing is fetched from Google', test: ({ output }) => passed(output, 'nothing is fetched from Google or any other font host') },
    { label: 'The fonts are preloaded', test: ({ output }) => passed(output, 'the fonts are preloaded') },
    { label: 'font-display is swap', test: ({ output }) => passed(output, 'font-display is swap') },
    { label: 'The CSS uses the font variables', test: ({ output }) => passed(output, 'the CSS uses the font variables') },
    { label: 'The CSS no longer names the fonts directly', test: ({ output }) => passed(output, 'the CSS no longer names the fonts directly') },
    { label: 'Each font has a fallback stack', test: ({ output }) => passed(output, 'each font has a fallback stack') },
  ],
  hints: [
    'The font files are already in src/assets/fonts. In the config, each entry needs provider: fontProviders.local(), a name, a cssVariable, and options.variants with the src path, weight and style.',
    'Defining a font in the config isn\'t enough. Add <Font cssVariable="--font-figtree" preload /> to the layout\'s <head> (imported from astro:assets) so Astro writes the @font-face and the preload link.',
    'In the CSS, font-family: var(--font-figtree); uses the stack Astro built, fallbacks included. Delete the @import line at the top of site.css.',
  ],
} satisfies LessonMeta;
