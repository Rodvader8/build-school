import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Typing data files',
  minutes: 25,
  kind: 'node',
  entry: 'main.ts',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund',
  checks: [
    { label: 'tsc finds no type errors', test: ({ output }) => passed(output, 'types check cleanly') },
    { label: 'No @ts-expect-error comments are left hiding mistakes', test: ({ output }) => passed(output, 'no @ts-expect-error or @ts-ignore left') },
    { label: 'The palette ends with satisfies Record<Region, string>', test: ({ output }) => passed(output, 'palette uses satisfies Record<Region, string>') },
    { label: 'The sales rows are fixed, not deleted', test: ({ output }) => passed(output, 'sales rows were fixed, not deleted') },
    { label: 'targets has all three regions', test: ({ output }) => passed(output, 'targets has all three regions') },
    { label: 'totalsByRegion returns a Record<Region, number>', test: ({ output }) => passed(output, 'totalsByRegion returns a Record<Region, number>') },
    { label: 'totalsByRegion adds up the revenue', test: ({ output }) => passed(output, 'totalsByRegion adds up the revenue') },
    { label: 'topRegion returns a Region, not just any string', test: ({ output }) => passed(output, 'topRegion returns a Region, not just any string') },
    { label: 'topRegion picks the biggest', test: ({ output }) => passed(output, 'topRegion picks the biggest') },
  ],
  hints: [
    'A typo in a string that has to match a union ("wets" instead of "west") is exactly what the Region type exists to catch. Fix the data, not the type.',
    'Add "satisfies Record<Region, string>" right after the closing brace of palette. Satisfies checks the shape without widening the values.',
    'const totals: Record<Region, number> = { north: 0, south: 0, west: 0 }; then add each row\'s revenue to totals[row.region].',
  ],
} satisfies LessonMeta;
