import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Types and inference',
  minutes: 25,
  kind: 'node',
  entry: 'main.ts',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund',
  checks: [
    { label: 'tsc finds no type errors', test: ({ output }) => passed(output, 'types check cleanly') },
    { label: 'No @ts-expect-error comments are left hiding mistakes', test: ({ output }) => passed(output, 'no @ts-expect-error or @ts-ignore left') },
    { label: 'No "any" types', test: ({ output }) => passed(output, 'no "any" types') },
    { label: 'loafCount is the number 12', test: ({ output }) => passed(output, 'loafCount is the number 12') },
    { label: 'The medium loaf exists and costs 6.5', test: ({ output }) => passed(output, 'the medium loaf costs 6.5') },
    { label: 'cheapest() copes with an empty list', test: ({ output }) => passed(output, 'cheapest finds the lowest price, and copes with an empty list') },
    { label: 'toQuantity() accepts text and numbers', test: ({ output }) => passed(output, 'toQuantity accepts text and numbers') },
    { label: 'firstPriceLabel() copes with an empty list', test: ({ output }) => passed(output, 'firstPriceLabel copes with an empty list') },
  ],
  hints: [
    'Delete the @ts-expect-error line above a problem, save, then run npx tsc --noEmit in the terminal. The error message tells you what tsc expected.',
    'A union type lets a value be one of several things: Size = \'small\' | \'medium\' | \'large\'. Narrow it with typeof raw === \'number\' before using string methods.',
    'When a value might be undefined, say so in the return type (number | undefined) and check for undefined before you use it.',
  ],
} satisfies LessonMeta;
