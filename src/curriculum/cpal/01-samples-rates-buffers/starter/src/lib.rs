// Lesson 1: samples, sample rates and buffers. Replace each todo!() with real code.

/// How many seconds `frames` frames last at `sample_rate` frames per second.
/// Hint: a frame is one sample per channel, and the rate is frames per second. Convert both with `as f32`.
pub fn seconds_for(frames: usize, sample_rate: u32) -> f32 {
    todo!()
}

/// How many whole frames fit in `seconds` seconds.
/// Hint: seconds * rate, rounded: `(x).round() as usize`.
pub fn frames_for(seconds: f32, sample_rate: u32) -> usize {
    todo!()
}

/// How long one buffer of `buffer_frames` frames takes to play, in milliseconds.
/// You can reuse `seconds_for`.
pub fn latency_ms(buffer_frames: usize, sample_rate: u32) -> f32 {
    todo!()
}

/// Turn one channel of samples into an interleaved buffer: each sample is repeated once per channel.
/// [0.1, 0.2] with 2 channels becomes [0.1, 0.1, 0.2, 0.2].
pub fn interleave_mono(mono: &[f32], channels: usize) -> Vec<f32> {
    todo!()
}

/// Fill an interleaved buffer with a ramp: frame i gets the value i / total_frames on every channel.
/// `buffer.chunks_mut(channels)` gives you one frame at a time; `.enumerate()` adds the frame number.
pub fn fill_ramp(buffer: &mut [f32], channels: usize) {
    todo!()
}
