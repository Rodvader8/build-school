import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Images with Pillow',
  minutes: 25,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'Thumbnails are 400px wide', test: ({ output }) => passed(output, 'thumbnail is 400 wide') },
    { label: 'They keep their shape (wide stays wide, tall stays tall)', test: ({ output }) => passed(output, 'thumbnail keeps its shape') },
    { label: 'Thumbnails are WebP', test: ({ output }) => passed(output, 'thumbnail is WebP') },
    { label: 'The share image is exactly 1200x630', test: ({ output }) => passed(output, 'share image is 1200x630') },
    { label: 'The share image is JPEG, never WebP', test: ({ output }) => passed(output, 'share image is JPEG, never WebP') },
    { label: 'It\'s cropped to fill, not squashed', test: ({ output }) => passed(output, 'share image is cropped, not squashed') },
  ],
  hints: [
    'resize wants a tuple: image.resize((width, height), Image.LANCZOS). Round the height to a whole number.',
    'The tall photo is 1120 by 1400, so at 400 wide it should be 500 tall.',
  ],
  realWorld: { label: 'Pillow, the Python imaging library', href: 'https://pillow.readthedocs.io/' },
} satisfies LessonMeta;
