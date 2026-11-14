import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'End-to-end tests',
  minutes: 45,
  kind: 'project',
  entry: 'tests/site.spec.mjs',
  checkEntry: 'check.mjs',
  devPort: 4885,
  devCommand: 'node start-server.mjs 4885',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The config uses one worker and doesn\'t run files in parallel', test: ({ output }) => passed(output, 'the config runs one test at a time') },
    { label: 'The config starts the local server itself (webServer)', test: ({ output }) => passed(output, 'the config starts the server') },
    { label: 'There are at least four tests and they all pass on the good page', test: ({ output }) => passed(output, 'four or more tests pass on the good page') },
    { label: 'Tracking requests are blocked in every test', test: ({ output }) => passed(output, 'tracking is blocked in the tests') },
    { label: 'Your tests catch a broken menu', test: ({ output }) => passed(output, 'the tests catch a broken menu') },
    { label: 'Your tests catch a missing error message', test: ({ output }) => passed(output, 'the tests catch a missing error message') },
    { label: 'Your tests catch a missing thank-you message', test: ({ output }) => passed(output, 'the tests catch a missing thank-you message') },
  ],
  hints: [
    'In playwright.config.mjs set workers: 1 and fullyParallel: false, and add webServer: { command: "node start-server.mjs", url: "http://127.0.0.1:4891/", reuseExistingServer: false } so the test run starts and stops the page itself.',
    'Put the tracker blocker in test.beforeEach, so it runs before every test: await page.route("**/analytics/**", (route) => route.abort()).',
    'A test only counts if it can fail. Write each one around a single behaviour, and assert something visible: await expect(page.locator("#thanks")).toBeVisible(). Check my work breaks the page three ways to see whether yours notice.',
  ],
} satisfies LessonMeta;
