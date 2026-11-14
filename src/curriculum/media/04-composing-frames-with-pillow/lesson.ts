import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Composing frames with Pillow',
  minutes: 40,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'safe_box gives the safe area for a 1080 x 1920 frame', test: ({ output }) => passed(output, 'safe_box for 1080x1920') },
    { label: 'safe_box scales to other sizes', test: ({ output }) => passed(output, 'safe_box scales') },
    { label: 'wrap_text keeps every line within the width and loses no words', test: ({ output }) => passed(output, 'wrap_text fits and keeps every word') },
    { label: 'wrap_text keeps a too-long word on its own line', test: ({ output }) => passed(output, 'wrap_text copes with a huge word') },
    { label: 'title_card makes an RGB image of the right size and colour', test: ({ output }) => passed(output, 'title_card size and colour') },
    { label: 'Short text stays inside the safe area, centred', test: ({ output }) => passed(output, 'short title is safe and centred') },
    { label: 'Long text wraps onto more lines and still stays inside the safe area', test: ({ output }) => passed(output, 'long title wraps inside the safe area') },
    { label: 'card_to_clip turns the image into a clip of the right length and size', test: ({ output }) => passed(output, 'card_to_clip makes a clip') },
  ],
  hints: [
    'safe_box: left = round(width * SAFE_SIDE), top = round(height * SAFE_TOP), right = width - left, bottom = height - round(height * SAFE_BOTTOM).',
    'wrap_text is a greedy loop: try adding the next word to the current line. If the line would be wider than max_width (draw.textlength(candidate, font=font)) and the line isn\'t empty, finish the line and start a new one with that word.',
    'In title_card, work out the block height (lines times line height), start y at top + (safe height - block height) // 2, and centre each line with x = (width - draw.textlength(line, font=font)) / 2.',
  ],
} satisfies LessonMeta;
