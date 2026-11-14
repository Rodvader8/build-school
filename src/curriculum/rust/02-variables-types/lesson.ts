import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Variables and types',
  minutes: 25,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'nightly_total multiplies nights by rate', test: ({ output }) => cargoPassed(output, 'nightly_total_multiplies_nights_by_rate') },
    { label: 'with_gst adds 10% (4400 gives 4840)', test: ({ output }) => cargoPassed(output, 'with_gst_adds_ten_percent') },
    { label: 'nights_label returns one night, short stay or long stay', test: ({ output }) => cargoPassed(output, 'nights_label_picks_the_right_words') },
    { label: 'stay_cost adds GST only when asked', test: ({ output }) => cargoPassed(output, 'stay_cost_adds_gst_only_when_asked') },
    { label: 'average_rate keeps the decimals', test: ({ output }) => cargoPassed(output, 'average_rate_keeps_the_decimals') },
  ],
  hints: [
    'The last line of a function has no semicolon and no return keyword: that expression is the value it gives back.',
    'Rust never mixes number types for you. If a u32 meets an f64, convert one with `as`, like `total as f64`.',
    'Check my work runs cargo test. Open tests/checks.rs to see exactly what each test calls.',
  ],
} satisfies LessonMeta;
