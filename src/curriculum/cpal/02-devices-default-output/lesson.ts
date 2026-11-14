import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Devices and the default output',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'channel_layout names mono, stereo and bigger layouts', test: ({ output }) => cargoPassed(output, 'channel_layouts_have_friendly_names') },
    { label: 'describe_config reads like a sentence', test: ({ output }) => cargoPassed(output, 'describe_config_reads_like_a_sentence') },
    { label: 'pick_sample_rate keeps a supported rate', test: ({ output }) => cargoPassed(output, 'pick_sample_rate_uses_the_wanted_rate_when_it_is_supported') },
    { label: 'pick_sample_rate falls back to the nearest edge', test: ({ output }) => cargoPassed(output, 'pick_sample_rate_falls_back_to_the_nearest_edge') },
    { label: 'frames_in_callback divides by the channel count', test: ({ output }) => cargoPassed(output, 'frames_in_callback_divides_by_channels') },
    { label: 'find_device matches part of a name, ignoring case', test: ({ output }) => cargoPassed(output, 'find_device_matches_part_of_a_name_ignoring_case') },
  ],
  hints: [
    'A device offers ranges, not a single rate: "anything from 8000 to 48000". Check the wanted rate against each range with (min..=max).contains(&wanted) before settling for a different one.',
    'Option<T> is Rust\'s "maybe nothing". Return Some(rate) when you have a rate and None when there are no ranges, which is what .min_by_key() already does on an empty list.',
    'format!("{name}: {sample_rate} Hz, {}", channel_layout(channels)) can mix named values and positional ones in the same string.',
  ],
  realWorld: { label: 'cpal, the Rust crate for cross-platform audio output', href: 'https://docs.rs/cpal' },
} satisfies LessonMeta;
