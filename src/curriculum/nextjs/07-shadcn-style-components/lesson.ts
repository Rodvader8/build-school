import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'shadcn-style components with Radix',
  minutes: 60,
  kind: 'project',
  entry: 'components/ui/dialog.jsx',
  checkEntry: 'check.mjs',
  devPort: 4847,
  devCommand: 'npm run dev -- --port 4847 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'cn joins class names and drops falsy ones',
    'cn lets the last Tailwind utility win',
    'opens one answer at a time',
    'can be used from the keyboard',
    'the FAQ page has one trigger per question',
    'opens from its trigger with a title and a description',
    'has a close button, and Escape closes it and returns focus to the trigger',
    'the site builds',
    'only the ui components are client components',
    'the ui components build their classes with cn()',
    'the FAQ page is prerendered with every question',
    'the home page has a pre-order dialog trigger',
    'there are no inline style props',
  ]),
  hints: [
    'cn is two small libraries in one line: return twMerge(clsx(inputs)). clsx turns strings, objects and arrays into one class string, and twMerge removes the earlier class when a later one clashes (px-2 then px-4 leaves px-4).',
    'Copy the shape of accordion.jsx for the dialog: "use client", import * as DialogPrimitive, then export small wrappers. Dialog, DialogTrigger and DialogClose are just the Radix parts; DialogContent wraps Portal, Overlay and Content, and adds a Close button with aria-label="Close".',
    'On the home page, <DialogTrigger asChild><Button>...</Button></DialogTrigger> puts the trigger behaviour on your own button. DialogContent must contain a DialogTitle, which gives the dialog its accessible name.',
  ],
} satisfies LessonMeta;
