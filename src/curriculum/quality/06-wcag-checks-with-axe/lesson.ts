import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'WCAG checks with axe-core',
  minutes: 40,
  kind: 'project',
  entry: 'site/index.html',
  checkEntry: 'check.mjs',
  devPort: 4836,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The page has a language, a title and one main landmark', test: ({ output }) => passed(output, 'language, title and landmarks') },
    { label: 'Text has enough contrast (4.5 to 1)', test: ({ output }) => passed(output, 'text has enough contrast') },
    { label: 'Every image has a text alternative', test: ({ output }) => passed(output, 'every image has a text alternative') },
    { label: 'Every form field has a label', test: ({ output }) => passed(output, 'every form field has a label') },
    { label: 'Every button and link has a name', test: ({ output }) => passed(output, 'every button and link has a name') },
    { label: 'Headings go down in order, starting from one h1', test: ({ output }) => passed(output, 'headings are in order') },
    { label: 'The first Tab stop is a working "skip to content" link', test: ({ output }) => passed(output, 'the first tab stop is a skip link') },
    { label: 'Tab order follows the reading order, with no positive tabindex', test: ({ output }) => passed(output, 'tab order follows the reading order') },
    { label: 'Every focused element has a visible focus indicator', test: ({ output }) => passed(output, 'focus is always visible') },
    { label: 'axe-core finds no violations at all', test: ({ output }) => passed(output, 'axe-core finds no violations') },
  ],
  hints: [
    'Run Check my work and read the first failure. axe tells you the rule and shows the exact HTML it found, so you can search for it in index.html.',
    'A <label for="x"> pairs with <input id="x">. An icon-only button needs a name: aria-label="Close notice" on the button and aria-hidden="true" on the decorative <svg>.',
    'Never remove the outline without replacing it. Use :focus-visible { outline: 3px solid #0b57d0; outline-offset: 2px; } so keyboard users can see where they are.',
  ],
} satisfies LessonMeta;
