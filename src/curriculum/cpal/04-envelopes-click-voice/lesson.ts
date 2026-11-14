import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Envelopes: the Bramble click voice',
  minutes: 35,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'decay_coefficient falls to 1/e after one time constant', test: ({ output }) => cargoPassed(output, 'the_decay_coefficient_shrinks_to_one_over_e_after_one_time_constant') },
    { label: 'A new voice is silent', test: ({ output }) => cargoPassed(output, 'a_new_voice_is_silent') },
    { label: 'Normal clicks peak near 0.35 and downbeats near 0.5', test: ({ output }) => cargoPassed(output, 'a_normal_click_peaks_near_0_35_and_a_downbeat_near_0_5') },
    { label: 'The downbeat is an octave higher', test: ({ output }) => cargoPassed(output, 'the_downbeat_is_an_octave_higher') },
    { label: 'The click fades, then switches itself off', test: ({ output }) => cargoPassed(output, 'the_click_fades_out_and_then_switches_itself_off') },
    { label: 'Every trigger restarts from zero at full strength', test: ({ output }) => cargoPassed(output, 'every_trigger_starts_from_zero_at_full_strength') },
    { label: 'fill writes one sample per frame to every channel', test: ({ output }) => cargoPassed(output, 'fill_writes_one_sample_per_frame_to_every_channel') },
  ],
  hints: [
    'An exponential decay is one multiplication per sample: amp *= decay. If decay is a little under 1 (like 0.9992), the volume sinks gently, fast at first in absolute terms and slower later, the way a real struck thing fades.',
    'The envelope and the oscillator are separate numbers you multiply together: the sine gives the shape from -1 to 1, and amp scales it. Read the sample first, then update both phase and amp.',
    'Resetting phase to 0.0 in trigger() matters. sin(0) is 0, so every click starts at silence and ramps up, instead of jumping straight in at some random point of the wave, which would pop.',
  ],
  realWorld: { label: 'cpal, the Rust crate for cross-platform audio output', href: 'https://docs.rs/cpal' },
} satisfies LessonMeta;
