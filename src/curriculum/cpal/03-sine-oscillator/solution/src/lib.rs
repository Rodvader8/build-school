// Lesson 3: a sine oscillator.
use std::f32::consts::TAU;

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
        self.freq = freq;
    }

    pub fn phase(&self) -> f32 {
        self.phase
    }

    /// The next sample of the wave, from -1.0 to 1.0.
    pub fn next_sample(&mut self) -> f32 {
        let sample = (self.phase * TAU).sin();
        self.phase += self.freq / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        sample
    }

    /// Fill an interleaved buffer: one new sample per frame, copied to every channel and scaled by `volume`.
    pub fn fill(&mut self, data: &mut [f32], channels: usize, volume: f32) {
        for frame in data.chunks_mut(channels) {
            let sample = self.next_sample() * volume;
            for out in frame.iter_mut() {
                *out = sample;
            }
        }
    }
}
