import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Threads, channels and atomics',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'sum_in_threads adds both halves on separate threads', test: ({ output }) => cargoPassed(output, 'sum_in_threads_adds_both_halves') },
    { label: 'Workers report back over a channel', test: ({ output }) => cargoPassed(output, 'workers_report_back_over_a_channel') },
    { label: 'An atomic counter survives eight threads', test: ({ output }) => cargoPassed(output, 'an_atomic_counter_survives_many_threads') },
    { label: 'A stop flag ends a worker loop', test: ({ output }) => cargoPassed(output, 'a_stop_flag_ends_the_loop') },
    { label: 'A ring buffer carries samples between threads', test: ({ output }) => cargoPassed(output, 'a_ring_buffer_carries_samples_between_threads') },
  ],
  hints: [
    'A thread closure needs `move` so it owns what it uses: thread::spawn(move || { ... }). Clone an Arc or a Sender before moving it in.',
    'A receiver loop only ends once every Sender has been dropped, including the original. Call drop(tx) after the spawning loop.',
    'Ordering::Relaxed is fine for all of these. Bramble uses it for simple flags where nothing else depends on the order.',
  ],
  realWorld: { label: 'The rtrb crate, the ring buffer Bramble uses', href: 'https://crates.io/crates/rtrb' },
} satisfies LessonMeta;
