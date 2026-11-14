import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'CI: tests on every commit',
  minutes: 45,
  kind: 'node',
  entry: 'package.json',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the workflow file is valid YAML with a name',
    'it runs on every push to main and on every pull request',
    'the job runs on ubuntu-latest, with a timeout',
    'it checks out the code and sets up Node with npm caching',
    'it installs with npm ci, not npm install',
    'it runs lint, test and build, in that order, after the install',
    'every npm script the workflow calls exists in package.json',
    'actions are pinned to a version, never @main or @master',
    'permissions are read-only',
    'a new push cancels the run it replaces',
    'package-lock.json is there for npm ci',
    'lint passes',
    'the tests pass',
    'the build passes and makes dist/',
    'npm run ci passes, so the workflow will too',
  ]),
  hints: [
    'Run npm run ci first and read the two failures. One is a leftover debug line, the other is a sort in the wrong direction.',
    'Steps are a list. A step is either "uses: actions/checkout@v4" or "run: npm ci". setup-node takes "with:" node-version and cache: npm.',
    'Top-level keys: name, on, concurrency, permissions, jobs. Under permissions, "contents: read". Under concurrency, a group and cancel-in-progress: true.',
  ],
} satisfies LessonMeta;
