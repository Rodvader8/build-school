import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Real-time rules: no locks or allocations in the callback',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'An f32 gain survives a trip through an AtomicU32', test: ({ output }) => cargoPassed(output, 'the_gain_survives_a_round_trip_through_an_atomic') },
    { label: 'render scales the tone by the shared gain', test: ({ output }) => cargoPassed(output, 'render_scales_the_tone_by_the_shared_gain') },
    { label: 'render makes zero allocations', test: ({ output }) => cargoPassed(output, 'render_does_not_allocate') },
    { label: 'The delay repeats its input after n frames', test: ({ output }) => cargoPassed(output, 'the_delay_repeats_the_input_after_n_frames') },
    { label: 'The delay still works after its buffer wraps', test: ({ output }) => cargoPassed(output, 'the_delay_keeps_working_after_its_buffer_has_wrapped') },
    { label: 'The delay allocates up front and never again', test: ({ output }) => cargoPassed(output, 'the_delay_allocates_up_front_and_never_again') },
  ],
  hints: [
    'Atomics only come in whole-number sizes, so to share an f32 you store its bit pattern: gain.to_bits() makes a u32, and f32::from_bits() turns it back. Nothing is lost.',
    'A ring buffer never grows. It has a fixed length and a write position that wraps round with `% len`. The oldest sample is the one you\'re about to overwrite, which is exactly what a delay line wants.',
    'Anything that can grow is a red flag in the callback: vec![], Vec::push, String, format!, Box::new, .to_vec(), .collect(). Make them in new() (or the UI thread), then reuse them.',
  ],
  realWorld: { label: 'The std::sync::atomic docs, the toolkit for sharing values safely with the audio thread', href: 'https://doc.rust-lang.org/std/sync/atomic/' },
} satisfies LessonMeta;
