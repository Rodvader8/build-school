import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Traits',
  minutes: 35,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'Square makes a square wave and is named "square"', test: ({ output }) => cargoPassed(output, 'square_wave_flips_every_half_period') },
    { label: 'Ramp climbs by its step and is named "ramp"', test: ({ output }) => cargoPassed(output, 'ramp_climbs_by_its_step') },
    { label: 'describe comes free from the trait default', test: ({ output }) => cargoPassed(output, 'describe_comes_free_from_the_trait_default') },
    { label: 'peak works on any Source (generics)', test: ({ output }) => cargoPassed(output, 'peak_works_on_any_source_with_generics') },
    { label: 'mix adds boxed sources together (trait objects)', test: ({ output }) => cargoPassed(output, 'mix_adds_boxed_sources_together') },
  ],
  hints: [
    'An impl block for a trait looks like `impl Source for Square { fn next_sample(&mut self) -> f32 { ... } fn name(&self) -> String { ... } }`.',
    'For Ramp, save the old value in a variable before adding the step, then return the saved one.',
    'In mix, loop over the frames, and inside that loop over `sources.iter_mut()`, adding each next_sample().',
  ],
} satisfies LessonMeta;
