import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Charts with Recharts',
  minutes: 60,
  kind: 'project',
  entry: 'src/components/ChartFigure.jsx',
  checkEntry: 'check.mjs',
  devPort: 4852,
  devCommand: 'npm run dev -- --port 4852 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'describeSeries names the highest and lowest points',
    'draws one bar per month',
    'starts the scale at zero, so bar heights are in proportion',
    'labels the months along the bottom and the dollars up the side',
    'is a named figure, with a one-sentence picture description',
    'offers the same numbers as a table',
    'draws one line with a dot for every month',
    'marks the 30% target with a labelled reference line',
    'is a named figure with a description and a table',
    'the app builds',
    'there are no inline style props',
    'colours come from the theme, not one-off values',
    'both charts use the ChartFigure frame and turn on Recharts accessibilityLayer',
    'chart colours come from the theme variables',
  ]),
  hints: [
    'describeSeries: find the row with the biggest value with data.reduce((best, row) => (row[key] > best[key] ? row : best)), do the same for the smallest, then build the sentence with a template string.',
    'ChartFigure: <figure aria-labelledby={id}> with <figcaption id={id}>, then <div role="img" aria-label={summary}> around {children}, then <details> holding a normal table. useId() from react gives you a safe id.',
    'LabourChart is RevenueChart with a LineChart instead of a BarChart. Import Line, LineChart and ReferenceLine from recharts. A line chart doesn\'t have to start at zero, so use domain [24, 36] on the YAxis.',
  ],
} satisfies LessonMeta;
