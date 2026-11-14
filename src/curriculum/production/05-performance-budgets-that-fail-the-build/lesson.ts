import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Performance budgets that fail the build',
  minutes: 50,
  kind: 'node',
  entry: 'scripts/budgets.mjs',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'measure() reports gzip sizes for initial JS, lazy JS, CSS and images',
    'evaluate() returns one violation for each budget that is over',
    'budgets.json sets all four budgets, at sensible ceilings',
    'the budget script exits 1 on a bloated build and names every budget it broke',
    'the budget script exits 0 on a lean build',
    'npm run build runs the budget check after the build',
    'the real build passes its budgets, with the chart code split off to load on demand',
    'a tighter budget makes the real build fail',
    'lighthouse-assertions.json lists the structural audits',
    'Lighthouse structural assertions pass on the built app',
    'the Lighthouse assertions catch a page with an unsized image',
  ]),
  hints: [
    'gzip with zlib: gzipSync(readFileSync(file)).length. Collect the initial scripts from index.html with a regex for <script src="..."> and <link rel="modulepreload" href="...">.',
    'evaluate: build an array of [name, actualKB] pairs, filter the ones above budgets[name], and map them to { budget, limit, actual }.',
    'In src/main.js, replace the top-level import with: const { drawChart } = await import("./charts.js") inside the click handler. Vite turns that into a separate chunk.',
  ],
} satisfies LessonMeta;
