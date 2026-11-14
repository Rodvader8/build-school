import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Heatmaps and grids',
  minutes: 55,
  kind: 'project',
  entry: 'src/heat.js',
  checkEntry: 'check.mjs',
  devPort: 4853,
  devCommand: 'npm run dev -- --port 4853 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'heatLevel puts a value into one of five equal slices of 0 to max',
    'heatLevel copes with negative, over-the-top and empty data',
    'is a table with a caption, a header for each column and a header for each row',
    'prints each value in its cell and describes it in words',
    'shades each cell by its share of the biggest value',
    'has a legend with five swatches that says which end is more',
    'keeps the text readable: every step passes WCAG contrast',
    'the occupancy heatmap is 4 rooms by 7 days, with the busiest cell at the top step',
    'the labour grid is 8 time blocks by 7 days, and describes staffing',
    'the app builds',
    'there are no inline style props',
    'colours come from the theme, not one-off values',
    'the five heat colours are in the stylesheet as classes',
    'shades come from the scale, never typed into a cell',
  ]),
  hints: [
    'heatLevel: bail out with 0 when value or max isn\'t above zero, otherwise Math.min(steps - 1, Math.floor((value / max) * steps)). The Math.min stops a value equal to max from landing on a sixth step.',
    'HeatGrid is a table inside a card. Work out max once at the top (Math.max(...values.flat())), then in each cell call heatLevel(values[r][c], max) and use the result to pick HEAT_CLASSES[level] and HEAT_TEXT[level].',
    'HeatLegend maps over HEAT_CLASSES to make five spans. They\'re decoration, so aria-hidden="true", and the group around them carries the aria-label that says which end is more.',
  ],
} satisfies LessonMeta;
