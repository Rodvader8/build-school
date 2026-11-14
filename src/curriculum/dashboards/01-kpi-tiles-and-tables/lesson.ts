import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'KPI tiles and tables',
  minutes: 60,
  kind: 'project',
  entry: 'src/components/KpiTile.jsx',
  checkEntry: 'check.mjs',
  devPort: 4851,
  devCommand: 'npm run dev -- --port 4851 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'formatMoney adds the dollar sign, commas and the right decimals',
    'formatPercent rounds to one decimal by default',
    'changePct gives the percentage change, and 0 when there was nothing before',
    'shows its label and its value',
    'says Up or Down in words, with the arrow hidden from screen readers',
    'judges good or bad by what the number is: a rise in cost is bad news',
    'has a caption and a column header for each column',
    'starts every row with a row header',
    'right-aligns numbers with tabular figures, and formats them',
    'adds a Total row when totals are given',
    'shows four tiles with the real numbers and a row for each venue',
    'the app builds',
    'there are no inline style props',
    'colours come from the theme, not one-off values',
    'numbers use tabular figures, so columns of digits line up',
    'the table has a screen-reader caption',
  ]),
  hints: [
    'Start with format.js: new Intl.NumberFormat(\'en-AU\', { style: \'currency\', currency: \'AUD\', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount). changePct is ((current - previous) / previous) * 100, guarded against dividing by zero.',
    'In KpiTile, work out three things first: flat (change === 0), up (change > 0) and good (up === goodWhenUp). Then render. The sentence "Up 3.3% on last month" comes from Math.abs(change).toFixed(1).',
    'In DataTable, loop over columns inside each row. The first column becomes <th scope="row"> and the rest <td>. A numeric column gets "text-right tabular-nums" on its header and cells so the digits line up.',
  ],
} satisfies LessonMeta;
