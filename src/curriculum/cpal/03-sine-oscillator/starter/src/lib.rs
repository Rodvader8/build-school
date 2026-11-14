// Lesson 3: a sine oscillator. Replace each todo!() with real code.
use std::f32::consts::TAU; // TAU is 2 * pi: one full turn

pub struct Sine {
    phase: f32, // where we are in the cycle, 0.0 up to (but not including) 1.0
    freq: f32,
    sample_rate: f32,
}

impl Sine {
    pub fn new(freq: f32, sample_rate: f32) -> Self {
        Sine { phase: 0.0, freq, sample_rate }
    }

    /// Change pitch without touching the phase, so the wave carries on smoothly.
    pub fn set_frequency(&mut self, freq: f32) {
        todo!()
    }

    pub fn phase(&self) -> f32 {
        self.phase
    }

    /// The next sample of the wave, from -1.0 to 1.0.
    /// 1. sample = (phase * TAU).sin()
    /// 2. advance the phase by freq / sample_rate (the fraction of a cycle one sample covers)
    /// 3. if the phase reached 1.0, take 1.0 off it (don't set it to 0, or you lose the leftover)
    /// Return the sample from step 1.
    pub fn next_sample(&mut self) -> f32 {
        todo!()
    }

    /// Fill an interleaved buffer: ONE new sample per frame, copied to every channel and scaled by `volume`.
    /// Hint: `for frame in data.chunks_mut(channels)`, like lesson 1.
    pub fn fill(&mut self, data: &mut [f32], channels: usize, volume: f32) {
        todo!()
    }
}
