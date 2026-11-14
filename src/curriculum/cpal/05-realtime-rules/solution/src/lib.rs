// Lesson 5: real-time rules. The audio thread must never wait, lock, or ask for memory.
use std::f32::consts::TAU;
use std::sync::atomic::{AtomicU32, Ordering};

/// Share an f32 between threads by storing its bits in an AtomicU32. No lock needed.
pub fn set_gain(shared: &AtomicU32, gain: f32) {
    shared.store(gain.to_bits(), Ordering::Relaxed);
}

pub fn get_gain(shared: &AtomicU32) -> f32 {
    f32::from_bits(shared.load(Ordering::Relaxed))
}

pub struct Tone {
    phase: f32,
    step: f32,
}

impl Tone {
    pub fn new(freq: f32, sample_rate: f32) -> Self {
        Tone { phase: 0.0, step: freq / sample_rate }
    }

    /// Fill `out` (interleaved, `channels` per frame) with the tone, scaled by the shared gain.
    /// Runs on the audio thread, so: no allocating, no locks.
    pub fn render(&mut self, out: &mut [f32], channels: usize, gain: &AtomicU32) {
        let gain = get_gain(gain); // read once per buffer
        for frame in out.chunks_mut(channels) {
            let sample = (self.phase * TAU).sin() * gain;
            self.phase += self.step;
            if self.phase >= 1.0 {
                self.phase -= 1.0;
            }
            for slot in frame.iter_mut() {
                *slot = sample;
            }
        }
    }
}

/// A delay line built on a buffer that's allocated once, in `new`, and then only ever reused.
pub struct Delay {
    buffer: Vec<f32>,
    write: usize,
}

impl Delay {
    pub fn new(max_frames: usize) -> Self {
        Delay { buffer: vec![0.0; max_frames], write: 0 }
    }

    /// Store `input`, and return the sample that went in `frames` calls ago (silence at first).
    /// `frames` must be less than the `max_frames` the delay was made with.
    pub fn process(&mut self, input: f32, frames: usize) -> f32 {
        let len = self.buffer.len();
        let read = (self.write + len - frames) % len;
        let delayed = self.buffer[read];
        self.buffer[self.write] = input;
        self.write = (self.write + 1) % len;
        delayed
    }
}
