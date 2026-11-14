import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'ffmpeg basics: cut, join, resize',
  minutes: 40,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'probe() reads width, height, duration and audio', test: ({ output }) => passed(output, 'probe reads the facts') },
    { label: 'probe() notices when there\'s no audio', test: ({ output }) => passed(output, 'probe spots a silent clip') },
    { label: 'cut() makes a 1 second clip from a 3 second one', test: ({ output }) => passed(output, 'cut has the right length') },
    { label: 'cut() starts where you asked', test: ({ output }) => passed(output, 'cut starts in the right place') },
    { label: 'cut() keeps the sound', test: ({ output }) => passed(output, 'cut keeps the audio') },
    { label: 'join() adds two clips end to end', test: ({ output }) => passed(output, 'join adds the lengths') },
    { label: 'join() copes with spaces in file names and leaves no mess', test: ({ output }) => passed(output, 'join copes with spaces and cleans up') },
    { label: 'resize() scales to the width, keeping the shape', test: ({ output }) => passed(output, 'resize keeps the shape') },
    { label: 'resize() keeps the sound and an even height', test: ({ output }) => passed(output, 'resize keeps audio and an even height') },
  ],
  hints: [
    'ffprobe -v error -print_format json -show_streams -show_format file.mp4 prints JSON you can read with json.loads. The duration is under "format", the size under the stream whose codec_type is "video".',
    'Put -ss and -t as separate list items, and the command as a list: ["ffmpeg", "-y", "-ss", str(start), "-i", src, "-t", str(duration), ..., dst]. -ss before -i seeks fast.',
    'Join needs a text file with one line per clip: file \'/full/path.mp4\'. Run ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4. For resize, -vf scale=WIDTH:-2 keeps the shape and the height even.',
  ],
} satisfies LessonMeta;
