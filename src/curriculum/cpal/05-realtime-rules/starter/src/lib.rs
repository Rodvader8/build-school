// Lesson 5: real-time rules. The audio thread must never wait, lock, or ask for memory.
// Three jobs below. The tests count allocations, so a stray vec![] or format! in the wrong place fails.
use std::f32::consts::TAU;
use std::sync::atomic::{AtomicU32, Ordering};

/// Share an f32 between threads by storing its bits in an AtomicU32. No lock needed.
/// Hint: `shared.store(gain.to_bits(), Ordering::Relaxed)`.
pub fn set_gain(shared: &AtomicU32, gain: f32) {
    todo!()
}

/// The other half: `f32::from_bits(shared.load(Ordering::Relaxed))`.
pub fn get_gain(shared: &AtomicU32) -> f32 {
    todo!()
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
    ///
    /// This version works, but it makes a temporary Vec on every call. On the audio thread that's a bug:
    /// allocating can take a lock inside the system allocator, and a lock can take too long.
    /// Rewrite it to write straight into `out`, with no Vec, and read the gain once at the top.
    pub fn render(&mut self, out: &mut [f32], channels: usize, gain: &AtomicU32) {
        let gain = get_gain(gain);
        let mut scratch = vec![0.0_f32; out.len() / channels];
        for slot in scratch.iter_mut() {
            *slot = (self.phase * TAU).sin() * gain;
            self.phase += self.step;
            if self.phase >= 1.0 {
                self.phase -= 1.0;
            }
        }
        for (frame, value) in out.chunks_mut(channels).zip(scratch) {
            for slot in frame.iter_mut() {
                *slot = value;
            }
        }
    }
}

/// A delay line built on a buffer that's allocated once, in `new`, and then only ever reused.
pub struct Delay {
    buffer: Vec<f32>,
    write: usize, // where the next input goes
}

impl Delay {
    /// Allocate the whole buffer here, full of silence: `vec![0.0; max_frames]`.
    pub fn new(max_frames: usize) -> Self {
        todo!()
    }

    /// Store `input`, and return the sample that went in `frames` calls ago (silence at first).
    /// `frames` must be less than the `max_frames` the delay was made with.
    /// A ring buffer: the read position is `(write + len - frames) % len`. Read it BEFORE writing the new
    /// sample, then advance `write` by one, wrapping with `% len`. Never push, insert or remove.
    pub fn process(&mut self, input: f32, frames: usize) -> f32 {
        todo!()
    }
}
