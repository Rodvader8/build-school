import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Screenshots at four widths',
  minutes: 30,
  kind: 'project',
  entry: 'shots.mjs',
  checkEntry: 'check.mjs',
  devPort: 4852,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'shots.mjs runs from start to finish', test: ({ output }) => passed(output, 'shots.mjs runs') },
    { label: 'A PNG exists for each width: 375, 768, 1280 and 1920', test: ({ output }) => passed(output, 'a png exists for each width') },
    { label: 'Each screenshot is exactly as wide as its viewport', test: ({ output }) => passed(output, 'each screenshot is as wide as its viewport') },
    { label: 'They are full-page shots, taller than the window', test: ({ output }) => passed(output, 'the shots are full page') },
    { label: 'Each width is genuinely different (the layout responded)', test: ({ output }) => passed(output, 'each width is different') },
    { label: 'Tracking requests are blocked', test: ({ output }) => passed(output, 'tracking requests are blocked') },
    { label: 'It uses one browser and one page for all four', test: ({ output }) => passed(output, 'one browser for all four widths') },
  ],
  hints: [
    'Loop over the widths with for...of. Inside: await page.setViewportSize({ width, height: 800 }), then page.screenshot({ path, fullPage: true }).',
    'Name files so they sort and read well: shots/home-375.png, shots/home-768.png... Create the shots folder first with mkdirSync("shots", { recursive: true }).',
    'Do not launch a new browser per width. One browser, one page, and change the viewport between shots. After a resize, wait for the layout to settle by awaiting document.fonts.ready.',
  ],
} satisfies LessonMeta;
