import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Generics, lightly',
  minutes: 25,
  kind: 'node',
  entry: 'main.ts',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund',
  checks: [
    { label: 'tsc finds no type errors', test: ({ output }) => passed(output, 'types check cleanly') },
    { label: 'No "any" types are left', test: ({ output }) => passed(output, 'no "any" types') },
    { label: 'No @ts-expect-error comments in main.ts', test: ({ output }) => passed(output, 'no @ts-expect-error or @ts-ignore left') },
    { label: 'firstOf keeps the item type', test: ({ output }) => passed(output, 'firstOf keeps the item type') },
    { label: 'groupBy keeps the item type', test: ({ output }) => passed(output, 'groupBy keeps the item type') },
    { label: 'mapResult changes the value type', test: ({ output }) => passed(output, 'mapResult changes the value type') },
    { label: 'firstOf gives the first item, or undefined', test: ({ output }) => passed(output, 'firstOf gives the first item, or undefined') },
    { label: 'groupBy groups by the key callback', test: ({ output }) => passed(output, 'groupBy groups by the key callback') },
    { label: 'parsePrice reads a price', test: ({ output }) => passed(output, 'parsePrice reads a price') },
    { label: 'parsePrice reports a failure', test: ({ output }) => passed(output, 'parsePrice reports a failure') },
    { label: 'mapResult maps good results and passes failures through', test: ({ output }) => passed(output, 'mapResult maps a good result and passes a failure through') },
  ],
  hints: [
    'function firstOf<T>(items: T[]): T | undefined: the <T> declares a placeholder, and T is then used like any other type.',
    'For groupBy you need two placeholders: <T, K extends string>. The result type is Partial<Record<K, T[]>>, because not every key will be present.',
    'mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U>. On the failure branch you can return the result as it is.',
  ],
} satisfies LessonMeta;
