import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Meters with atomics',
  minutes: 35,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'The meter remembers the loudest sample', test: ({ output }) => cargoPassed(output, 'the_meter_remembers_the_loudest_sample_it_has_seen') },
    { label: 'take returns the peak and resets it', test: ({ output }) => cargoPassed(output, 'take_returns_the_peak_and_starts_again_from_zero') },
    { label: 'An empty block changes nothing', test: ({ output }) => cargoPassed(output, 'an_empty_block_changes_nothing') },
    { label: 'Many threads can update one meter', test: ({ output }) => cargoPassed(output, 'many_threads_can_update_one_meter_and_the_loudest_wins') },
    { label: 'A reader sees a rising value while a writer works', test: ({ output }) => cargoPassed(output, 'a_reader_sees_a_rising_value_while_a_writer_works') },
    { label: 'peak_to_db uses 20 log10 with a -60 floor', test: ({ output }) => cargoPassed(output, 'peak_to_db_uses_20_log10_with_a_floor_of_minus_60') },
    { label: 'The displayed level jumps up and falls slowly', test: ({ output }) => cargoPassed(output, 'the_displayed_level_jumps_up_instantly_and_falls_slowly') },
  ],
  hints: [
    'Meter methods take &self, not &mut self. Atomics change through a shared reference, which is exactly why a Meter inside an Arc can be updated from one thread and read from another.',
    'fetch_max keeps whichever is larger, and does it as a single indivisible step. Two threads updating at once can never make the stored peak go DOWN, which a read-then-write would allow.',
    'f32::log10 and f32::max are your tools for the decibel conversion. 0.0.log10() is negative infinity, which is why the -60 floor matters: it keeps silence a sensible number.',
  ],
  realWorld: { label: 'The std::sync::atomic docs, the toolkit for sharing values safely with the audio thread', href: 'https://doc.rust-lang.org/std/sync/atomic/' },
} satisfies LessonMeta;
