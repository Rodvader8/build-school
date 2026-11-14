// Lesson 9: meters with atomics. The audio thread records; the UI thread reads. Replace each todo!() with real code.
use std::sync::atomic::{AtomicU32, Ordering};

/// A peak meter that can be shared between threads with no lock.
/// The loudest level so far is stored as the bits of an f32 (like the gain in lesson 5). For non-negative floats,
/// comparing the bits as integers gives the same order as comparing the numbers, so `fetch_max` works on them directly.
pub struct Meter {
    peak: AtomicU32,
}

impl Default for Meter {
    fn default() -> Self {
        Self::new()
    }
}

impl Meter {
    pub fn new() -> Self {
        Meter { peak: AtomicU32::new(0.0_f32.to_bits()) }
    }

    /// Called from the audio thread with each buffer: remember the loudest sample (ignoring its sign).
    /// Find the block's largest |sample| (an empty block counts as 0.0), then
    /// `self.peak.fetch_max(loudest.to_bits(), Ordering::Relaxed)`. Note: &self, not &mut self.
    pub fn update(&self, block: &[f32]) {
        todo!()
    }

    /// Read the peak without changing it.
    pub fn peek(&self) -> f32 {
        todo!()
    }

    /// Read the peak and reset it to zero in one step, so the next reading covers only what comes after.
    /// Hint: `swap` stores a new value and returns the old one, atomically.
    pub fn take(&self) -> f32 {
        todo!()
    }
}

/// Convert a linear level (1.0 is full scale) to decibels: 20 * log10(peak), never going below -60.
pub fn peak_to_db(peak: f32) -> f32 {
    todo!()
}

/// How a meter looks on screen: it jumps straight up to a louder reading, but falls back no faster than
/// `fall_per_second` (in dB) times `dt` seconds, and never below the real level.
pub fn fall(previous: f32, new_level: f32, fall_per_second: f32, dt: f32) -> f32 {
    todo!()
}
