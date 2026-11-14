import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Project: a thumbnail tool',
  minutes: 60,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'It runs without errors', test: ({ output }) => passed(output, 'runs without errors') },
    { label: 'One WebP thumbnail per photo, named after it', test: ({ output }) => passed(output, 'one thumbnail per photo') },
    { label: 'Thumbnails follow --width (320)', test: ({ output }) => passed(output, 'thumbnails are 320 wide') },
    { label: 'contact-sheet.jpg is saved', test: ({ output }) => passed(output, 'contact sheet exists') },
    { label: 'The sheet holds all three side by side', test: ({ output }) => passed(output, 'contact sheet holds all three side by side') },
    { label: 'It prints a summary: "3 thumbnails, ..."', test: ({ output }) => passed(output, 'prints a summary') },
    { label: '--help explains the options', test: ({ output }) => passed(output, '--help works') },
    { label: 'A missing folder is a clear error, not a crash', test: ({ output }) => passed(output, 'a missing folder is a clear error, not a crash') },
  ],
  hints: [
    'Start from lesson 7 (argparse) and lesson 10 (Pillow). Copy what you wrote there.',
    'Make make_thumbnail return the small image, so you can reuse it for the contact sheet.',
    'Check args.folder.is_dir() before doing anything else.',
  ],
  realWorld: { label: 'Pillow, the imaging library behind scripts like this', href: 'https://pillow.readthedocs.io/' },
} satisfies LessonMeta;
