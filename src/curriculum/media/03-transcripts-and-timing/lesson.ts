import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Transcripts and timing',
  minutes: 40,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'parse_time reads an SRT time into seconds', test: ({ output }) => passed(output, 'parse_time reads SRT times') },
    { label: 'parse_srt reads cues, including two-line ones and Windows line endings', test: ({ output }) => passed(output, 'parse_srt reads cues') },
    { label: 'to_vtt writes a WEBVTT file with full stops in the times', test: ({ output }) => passed(output, 'to_vtt writes WebVTT') },
    { label: 'words_to_cues breaks at the end of a sentence', test: ({ output }) => passed(output, 'cues break at sentence ends') },
    { label: 'words_to_cues breaks at a long pause and at max_chars', test: ({ output }) => passed(output, 'cues break at pauses and length') },
    { label: 'words_to_cues keeps every word of the real transcript, within the length limit', test: ({ output }) => passed(output, 'no words lost from the real transcript') },
    { label: 'cues_for_clip keeps only cues in the window and shifts them to start at 0', test: ({ output }) => passed(output, 'cues_for_clip shifts and trims') },
    { label: 'cues_for_clip drops cues that only touch the edge', test: ({ output }) => passed(output, 'cues_for_clip ignores edge cues') },
  ],
  hints: [
    'parse_time: split "00:01:02,250" on ":" and then the last part on ",". Add hours * 3600 + minutes * 60 + seconds + milliseconds / 1000.',
    'For parse_srt, replace "\\r\\n" with "\\n", split on a blank line ("\\n\\n"), then in each block the first line is the number, the second is the time range (split on " --> "), and everything after is the text.',
    'In words_to_cues, keep a list of the current cue\'s words. Before adding a word, check three things: the sentence ended on the previous word, the pause since it is longer than max_gap, or the line would go over max_chars. If any is true, close the cue and start a new one.',
  ],
} satisfies LessonMeta;
