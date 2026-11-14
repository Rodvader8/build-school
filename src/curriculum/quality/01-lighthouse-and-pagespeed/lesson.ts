import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Lighthouse and PageSpeed',
  minutes: 30,
  kind: 'project',
  entry: 'measure.mjs',
  checkEntry: 'check.mjs',
  devPort: 4831,
  devCommand: 'node dev-server.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'median() gives the middle value of an odd list', test: ({ output }) => passed(output, 'median of an odd list') },
    { label: 'median() averages the middle two of an even list', test: ({ output }) => passed(output, 'median of an even list') },
    { label: 'median() sorts numbers properly and leaves your list alone', test: ({ output }) => passed(output, 'median sorts as numbers and does not change the list') },
    { label: 'measure.mjs runs three audits, not one', test: ({ output }) => passed(output, 'measure.mjs runs three audits') },
    { label: 'The report quotes the median score, LCP, TBT and CLS', test: ({ output }) => passed(output, 'the report quotes the medians') },
    { label: 'The report shows the spread between the best and worst run', test: ({ output }) => passed(output, 'the report shows the spread') },
    { label: 'It only ever audits a local page', test: ({ output }) => passed(output, 'it only audits a local page') },
  ],
  hints: [
    'Copy the array before sorting it ([...values].sort(...)), and sort with (a, b) => a - b. Plain sort() puts 100 before 9 because it compares text.',
    'In measure.mjs, push each result into the runs array inside a for loop, awaiting auditOnce(server.url) one at a time. Never run audits at the same time: they\'d fight over the CPU and spoil each other\'s numbers.',
    'spread is the best score minus the worst: Math.max(...scores) - Math.min(...scores).',
  ],
} satisfies LessonMeta;
