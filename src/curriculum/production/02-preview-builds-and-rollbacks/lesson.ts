import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Preview builds and rollbacks',
  minutes: 45,
  kind: 'node',
  entry: 'scripts/deploy.mjs',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'release copies the site into releases/<id> and writes release.json',
    'current is a symlink that points at the new release',
    'every release gets its own folder, and the history grows',
    'switching never leaves a moment with no working site (80 switches under load)',
    'the switch renames a temporary link over "current" and never deletes it first',
    'a preview build goes to previews/<name> and never touches the live site',
    'rolling back points current at the previous release',
    'rolling back keeps the bad release on disk, and refuses when there is nothing earlier',
    'prune keeps the newest few, plus the live release and the one before it',
    'npm run release deploys the site, and npm run rollback undoes it in one command',
  ]),
  hints: [
    'Do switchTo first, and test it by hand: run npm run release twice and look at ls -l current. Everything else builds on it.',
    'fs.cpSync(siteDir, target, { recursive: true }) copies a folder. fs.symlinkSync(target, linkPath) makes a link, and fs.renameSync(from, to) replaces the destination in one step.',
    'rollback: const { history } = readState(root); const at = history.indexOf(currentId(root)); the release before it is history[at - 1].',
  ],
} satisfies LessonMeta;
