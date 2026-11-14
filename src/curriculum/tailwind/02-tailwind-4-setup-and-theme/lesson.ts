import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Tailwind 4 setup and @theme',
  minutes: 35,
  kind: 'project',
  entry: 'src/style.css',
  checkEntry: 'check.mjs',
  devPort: 4822,
  devCommand: 'npm run dev -- --port 4822 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: '@theme defines the six colour tokens', test: ({ output }) => passed(output, '@theme defines the six colour tokens') },
    { label: 'The palette is dark with readable text', test: ({ output }) => passed(output, 'the palette is dark with readable text') },
    { label: '@theme defines a sans and a display font family', test: ({ output }) => passed(output, '@theme defines a sans and a display font family') },
    { label: 'The theme variables are in the built CSS', test: ({ output }) => passed(output, 'the theme variables are in the built CSS') },
    { label: 'The token utilities exist', test: ({ output }) => passed(output, 'the token utilities exist') },
    { label: 'Both fonts have an @font-face', test: ({ output }) => passed(output, 'both fonts have an @font-face') },
    { label: 'The fonts are self-hosted woff2 files', test: ({ output }) => passed(output, 'the fonts are self-hosted woff2 files') },
    { label: 'The markup uses tokens, not one-off values', test: ({ output }) => passed(output, 'the markup uses tokens, not one-off values') },
    { label: 'There are no inline styles', test: ({ output }) => passed(output, 'there are no inline styles') },
  ],
  hints: [
    'Each token\'s name decides its utility: --color-ink gives bg-ink, text-ink and border-ink, and --font-display gives font-display. Spell them exactly as the markup does.',
    'Two @font-face rules go in style.css, one per file in src/fonts. Use format("woff2") and font-display: swap, and give Geist font-weight: 100 900 because it\'s a variable font.',
    'If a token shows up as missing in the built CSS, check that the page really uses a class made from it. Tailwind only emits the variables you use.',
  ],
} satisfies LessonMeta;
