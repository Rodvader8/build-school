import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Opening pages and clicking',
  minutes: 30,
  kind: 'project',
  entry: 'tour.mjs',
  checkEntry: 'check.mjs',
  devPort: 4851,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'tour.mjs runs from start to finish', test: ({ output }) => passed(output, 'tour.mjs runs') },
    { label: 'It reads the page title', test: ({ output }) => passed(output, 'it reads the page title') },
    { label: 'It opens the menu and reads its links', test: ({ output }) => passed(output, 'it opens the menu and reads its links') },
    { label: 'It reads the list of services', test: ({ output }) => passed(output, 'it reads the services') },
    { label: 'It submits the empty form and sees the error', test: ({ output }) => passed(output, 'it sees the error on an empty form') },
    { label: 'It fills the form in properly and sees the thank-you', test: ({ output }) => passed(output, 'it fills the form and sees the thank-you') },
    { label: 'Analytics and tracking requests are blocked', test: ({ output }) => passed(output, 'tracking requests are blocked') },
    { label: 'It opens one browser and closes it', test: ({ output }) => passed(output, 'one browser, opened and closed') },
  ],
  hints: [
    'getByRole("button", { name: "Menu" }) finds the way a person would: by what it is and what it says. Click it with await ....click().',
    'For the form: await page.getByLabel("Your name").fill("Sam"), the same for Email, then page.getByRole("button", { name: "Send enquiry" }).click(). Read the result with page.locator("#thanks").textContent().',
    'To block a request: await page.route("**/*", (route) => ...). If the URL matches a tracker, call route.abort(), otherwise route.continue(). Register it before page.goto.',
  ],
} satisfies LessonMeta;
