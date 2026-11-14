import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Islands with Preact',
  minutes: 35,
  kind: 'project',
  entry: 'src/components/Estimator.jsx',
  checkEntry: 'check.mjs',
  devPort: 4817,
  devCommand: 'npm run dev -- --port 4817 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'The config uses the Preact integration', test: ({ output }) => passed(output, 'the config uses the Preact integration') },
    { label: 'The page has exactly one island', test: ({ output }) => passed(output, 'the page has exactly one island') },
    { label: 'The island hydrates on visible or idle', test: ({ output }) => passed(output, 'the island hydrates when it is needed (visible or idle)') },
    { label: 'The island is server-rendered with the right total', test: ({ output }) => passed(output, 'the island is server-rendered first, with the right total') },
    { label: 'The label is linked to the slider', test: ({ output }) => passed(output, 'the label is linked to the slider') },
    { label: 'Preact is used, not React', test: ({ output }) => passed(output, 'Preact is used, not React') },
    { label: 'The site ships under 40 KB of JavaScript', test: ({ output }) => passed(output, 'the whole site ships under 40 KB of JavaScript') },
    { label: 'No inline styles', test: ({ output }) => passed(output, 'no inline styles, in .astro or .jsx files') },
  ],
  hints: [
    'The build fails until Astro knows how to render .jsx. In astro.config.mjs, import preact from \'@astrojs/preact\' and add integrations: [preact()].',
    'A client: directive goes on the component tag: <Estimator client:visible price={9} unit="loaf" />. Without one, the component is rendered to plain HTML and nothing is interactive.',
    'Inside the component, const total = price * qty; is all the arithmetic you need. The slider already calls setQty.',
  ],
} satisfies LessonMeta;
