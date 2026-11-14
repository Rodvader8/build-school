import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Folders and paths',
  minutes: 15,
  kind: 'terminal',
  entry: 'paths.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'A: you found logo.svg from inside site-monitor', test: ({ output }) => passed(output, 'A: logo.svg from site-monitor') },
    { label: 'B: you found summary.md from inside traffic-reporter', test: ({ output }) => passed(output, 'B: summary.md from traffic-reporter') },
    { label: 'C: you found settings.json from the 2026-11 folder', test: ({ output }) => passed(output, 'C: settings.json from the 2026-11 folder') },
    { label: 'D: you wrote the absolute path of monitor.py', test: ({ output }) => passed(output, 'D: the absolute path of monitor.py') },
  ],
  hints: [
    '`..` means "up one folder". To get from site-monitor to shared you go up, then down: ../shared/logo.svg.',
    'For C you need to climb out of 2026-11 and then out of reports, so two `..`, then go down into config.',
    'For D, open the terminal, type `cd projects/site-monitor` then `pwd`, and add /monitor.py to what it prints.',
  ],
} satisfies LessonMeta;
