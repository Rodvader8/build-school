// Lesson 1: samples, sample rates and buffers.

/// How many seconds `frames` frames last at `sample_rate` frames per second.
pub fn seconds_for(frames: usize, sample_rate: u32) -> f32 {
    frames as f32 / sample_rate as f32
}

/// How many whole frames fit in `seconds` seconds.
pub fn frames_for(seconds: f32, sample_rate: u32) -> usize {
    (seconds * sample_rate as f32).round() as usize
}

/// How long one buffer of `buffer_frames` frames takes to play, in milliseconds.
pub fn latency_ms(buffer_frames: usize, sample_rate: u32) -> f32 {
    seconds_for(buffer_frames, sample_rate) * 1000.0
}

/// Turn one channel of samples into an interleaved buffer: each sample is repeated once per channel.
pub fn interleave_mono(mono: &[f32], channels: usize) -> Vec<f32> {
    let mut out = Vec::with_capacity(mono.len() * channels);
    for &sample in mono {
        for _ in 0..channels {
            out.push(sample);
        }
    }
    out
}

/// Fill an interleaved buffer with a ramp: frame i gets the value i / total_frames on every channel.
pub fn fill_ramp(buffer: &mut [f32], channels: usize) {
    let total_frames = buffer.len() / channels;
    for (i, frame) in buffer.chunks_mut(channels).enumerate() {
        for sample in frame.iter_mut() {
            *sample = i as f32 / total_frames as f32;
        }
    }
}
