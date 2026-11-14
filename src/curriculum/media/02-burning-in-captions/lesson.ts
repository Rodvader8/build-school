import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Burning in captions',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'format_time writes SRT times (hours:minutes:seconds,milliseconds)', test: ({ output }) => passed(output, 'format_time writes SRT times') },
    { label: 'format_time rounds up cleanly (59.9996 is 00:01:00,000)', test: ({ output }) => passed(output, 'format_time carries on rounding') },
    { label: 'write_srt numbers the cues and separates them with a blank line', test: ({ output }) => passed(output, 'write_srt makes a valid file') },
    { label: 'write_srt keeps accents and two-line captions', test: ({ output }) => passed(output, 'write_srt keeps accents and line breaks') },
    { label: 'burn_captions keeps the size, length and sound', test: ({ output }) => passed(output, 'burn keeps size, length and audio') },
    { label: 'Text appears while a caption is on, and not before or after', test: ({ output }) => passed(output, 'captions appear on time') },
    { label: 'Captions sit in the bottom of the frame', test: ({ output }) => passed(output, 'captions sit at the bottom') },
    { label: 'margin lifts the captions up', test: ({ output }) => passed(output, 'margin moves captions up') },
    { label: 'font_size makes the text bigger', test: ({ output }) => passed(output, 'font_size changes the text') },
  ],
  hints: [
    'Work in whole milliseconds: ms = round(seconds * 1000). Then use divmod to peel off hours, minutes, seconds and milliseconds. Rounding first is what makes 59.9996 carry over properly.',
    'An SRT cue is the number, the time line "start --> end", the text, then a blank line. Open the file with encoding="utf-8".',
    'The subtitles filter chokes on odd paths. Run ffmpeg with cwd=the srt\'s folder and give the filter just the file name. The video and output paths then need to be absolute, so use Path(x).resolve().',
  ],
} satisfies LessonMeta;
