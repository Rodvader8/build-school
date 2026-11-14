import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'A sine oscillator',
  minutes: 35,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'The wave starts at zero and rises', test: ({ output }) => cargoPassed(output, 'the_first_sample_is_zero_and_the_wave_rises') },
    { label: 'A quarter-rate tone gives 0, 1, 0, -1', test: ({ output }) => cargoPassed(output, 'a_quarter_of_the_sample_rate_gives_zero_one_zero_minus_one') },
    { label: 'The phase wraps and never escapes 0 to 1', test: ({ output }) => cargoPassed(output, 'the_phase_always_stays_between_zero_and_one') },
    { label: 'fill copies each sample to every channel and applies the volume', test: ({ output }) => cargoPassed(output, 'fill_copies_each_sample_to_every_channel_and_applies_volume') },
    { label: 'Buffers join up with no jump', test: ({ output }) => cargoPassed(output, 'fill_carries_on_where_the_last_buffer_stopped') },
    { label: 'Changing the frequency keeps the phase', test: ({ output }) => cargoPassed(output, 'changing_frequency_does_not_reset_the_phase') },
    { label: 'Concert A has about 880 zero crossings a second', test: ({ output }) => cargoPassed(output, 'one_second_of_concert_a_crosses_zero_about_880_times') },
  ],
  hints: [
    'The phase is a fraction of a cycle, from 0 to 1. Each sample moves it on by frequency / sample_rate. At 440 Hz and 48000 Hz that\'s about 0.00917 of a cycle per sample.',
    'Wrap with subtraction: if self.phase >= 1.0 { self.phase -= 1.0 }. Setting it to 0.0 throws away the little bit past 1.0, which makes the pitch drift slightly flat.',
    'Read the sample BEFORE you advance the phase, so the very first sample is sin(0) = 0 and the wave starts from silence rather than with a click.',
  ],
  realWorld: { label: 'cpal, the Rust crate for cross-platform audio output', href: 'https://docs.rs/cpal' },
} satisfies LessonMeta;
