import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Data fetching and caching',
  minutes: 55,
  kind: 'project',
  entry: 'lib/bakery-api.js',
  checkEntry: 'check.mjs',
  devPort: 4843,
  devCommand: 'npm run dev -- --port 4843 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'groupByCategory groups items and keeps their order',
    'groupByCategory gives each group a capitalised label',
    'getMenu sets a cache lifetime and the menu tag',
    'the menu page shows one section per category with every item',
    'the site builds',
    'the menu function is marked "use cache" with a lifetime and a tag',
    'the oven status stays live (no cache)',
    'the home page sends a loading fallback for the live part',
    'the menu is prerendered into the page',
  ]),
  hints: [
    'In groupByCategory, loop over the items. Find the group with the same category (groups.find), or create it with a capitalised label, then push the item into its items array.',
    '"use cache" must be the first line inside the function body: async function getMenu() { \'use cache\'; cacheLife(\'hours\'); cacheTag(\'menu\'); ... }. Leave it off getOvenStatus.',
    'Live data can\'t be in the static shell. Move the await into a small async component (OvenStatus) and render it inside <Suspense fallback={...}> on the page. The build error tells you which route is blocked.',
  ],
} satisfies LessonMeta;
