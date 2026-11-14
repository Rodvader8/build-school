import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Samples, sample rates and buffers',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'seconds_for turns frames into seconds', test: ({ output }) => cargoPassed(output, 'seconds_for_divides_frames_by_rate') },
    { label: 'frames_for turns seconds into whole frames', test: ({ output }) => cargoPassed(output, 'frames_for_rounds_to_whole_frames') },
    { label: 'latency_ms gives a buffer\'s length in milliseconds', test: ({ output }) => cargoPassed(output, 'latency_is_the_buffer_length_in_milliseconds') },
    { label: 'interleave_mono repeats each sample for every channel', test: ({ output }) => cargoPassed(output, 'interleave_mono_repeats_each_sample_per_channel') },
    { label: 'fill_ramp writes the same value across a frame\'s channels', test: ({ output }) => cargoPassed(output, 'fill_ramp_gives_every_channel_in_a_frame_the_same_value') },
  ],
  hints: [
    'A "frame" is one sample for every channel at one instant. Stereo at 48000 Hz is 48000 frames a second, which is 96000 numbers a second.',
    'Rust won\'t mix integer and float types: write frames as f32 / sample_rate as f32. And `.round()` before `as usize`, or 0.01 seconds can come out one frame short.',
    'In fill_ramp the buffer\'s length is frames times channels, so total_frames = buffer.len() / channels.',
  ],
  realWorld: { label: 'cpal, the Rust crate for cross-platform audio output', href: 'https://docs.rs/cpal' },
} satisfies LessonMeta;
