import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Playing WAV files with hound',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'write_sine_wav makes a 16-bit mono file of the right length', test: ({ output }) => cargoPassed(output, 'write_sine_wav_makes_a_16_bit_mono_file_of_the_right_length') },
    { label: 'read_wav_mono gives floats and the file\'s rate', test: ({ output }) => cargoPassed(output, 'read_wav_mono_gives_back_floats_and_the_file_rate') },
    { label: 'Stereo files are averaged down to mono', test: ({ output }) => cargoPassed(output, 'stereo_files_are_mixed_down_by_averaging_the_channels') },
    { label: 'Float WAV files are read as they are', test: ({ output }) => cargoPassed(output, 'float_wav_files_are_read_as_they_are') },
    { label: 'A missing file is an error, not a crash', test: ({ output }) => cargoPassed(output, 'a_missing_file_is_an_error_not_a_crash') },
    { label: 'The player plays in order, then goes silent', test: ({ output }) => cargoPassed(output, 'the_player_plays_samples_in_order_then_goes_silent') },
    { label: 'The player resamples to the device\'s rate', test: ({ output }) => cargoPassed(output, 'the_player_resamples_when_the_device_rate_is_different') },
    { label: 'The player fills every channel', test: ({ output }) => cargoPassed(output, 'the_player_copies_each_sample_to_every_channel') },
  ],
  hints: [
    'WAV files store samples as integers: 16-bit is -32768 to 32767. Divide by 32768 (2 to the power of 15) to get floats in -1.0 to 1.0, and multiply to go the other way.',
    'The `?` operator passes an error up to the caller. Both functions return Result<_, hound::Error>, so hound\'s errors flow straight through with no conversion.',
    'If the file is at 22,050 Hz and the device runs at 44,100 Hz, the player must advance only half a file-sample per output frame (step = 0.5). Between whole samples it blends the two neighbours.',
  ],
  realWorld: { label: 'hound, the Rust crate for reading and writing WAV files', href: 'https://docs.rs/hound' },
} satisfies LessonMeta;
