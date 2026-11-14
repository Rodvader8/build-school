import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Typing the DOM',
  minutes: 25,
  kind: 'node',
  entry: 'main.ts',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund',
  checks: [
    { label: 'tsc finds no type errors', test: ({ output }) => passed(output, 'types check cleanly') },
    { label: 'No @ts-expect-error comments are left hiding mistakes', test: ({ output }) => passed(output, 'no @ts-expect-error or @ts-ignore left') },
    { label: 'No "as" assertions used to dodge the checker', test: ({ output }) => passed(output, 'no type assertions ("as") to dodge the checker') },
    { label: 'readQty reads a number and copes with null', test: ({ output }) => passed(output, 'readQty reads a number and copes with null') },
    { label: 'readQty treats bad input as 0', test: ({ output }) => passed(output, 'readQty treats bad input as 0') },
    { label: 'setTotal writes the price and copes with null', test: ({ output }) => passed(output, 'setTotal writes the price, and copes with null') },
    { label: 'stepFromClick reads data-step', test: ({ output }) => passed(output, 'stepFromClick reads data-step from an element') },
    { label: 'stepFromClick ignores targets that are not elements', test: ({ output }) => passed(output, 'stepFromClick ignores targets that are not elements') },
    { label: 'totalFor multiplies price by quantity', test: ({ output }) => passed(output, 'totalFor multiplies the unit price by the quantity') },
  ],
  hints: [
    'if (!input) return 0; at the top of a function removes null from the type for everything below it.',
    'e.target is an EventTarget. if (!(target instanceof HTMLElement)) return 0; narrows it to something with a dataset.',
    'root.querySelector<HTMLInputElement>(\'#qty\') tells TypeScript what you expect to find. It still returns null if nothing matches.',
  ],
} satisfies LessonMeta;
