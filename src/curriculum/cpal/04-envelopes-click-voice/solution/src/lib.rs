// Lesson 4: envelopes, and the click voice that Bramble's metronome uses.

/// The number to multiply the volume by every sample so that it falls to 1/e (about 37%) of itself
/// after `time_constant` seconds.
pub fn decay_coefficient(time_constant: f64, sample_rate: f64) -> f64 {
    (-1.0 / (time_constant * sample_rate)).exp()
}

/// A sine burst with an exponential decay.
pub struct ClickVoice {
    sample_rate: f64,
    phase: f64,
    freq: f64,
    amp: f64,
    decay: f64,
}

impl ClickVoice {
    pub fn new(sample_rate: f64) -> Self {
        ClickVoice { sample_rate, phase: 0.0, freq: 880.0, amp: 0.0, decay: decay_coefficient(0.025, sample_rate) }
    }

    /// Start a click. A downbeat is an octave higher (1760 Hz) and louder (0.5); a normal beat is 880 Hz at 0.35.
    pub fn trigger(&mut self, downbeat: bool) {
        self.phase = 0.0;
        self.freq = if downbeat { 1760.0 } else { 880.0 };
        self.amp = if downbeat { 0.5 } else { 0.35 };
    }

    /// True while the click is still audible.
    pub fn is_active(&self) -> bool {
        self.amp >= 1e-4
    }

    /// The next sample.
    pub fn next(&mut self) -> f32 {
        if !self.is_active() {
            return 0.0;
        }
        let sample = (self.phase * std::f64::consts::TAU).sin() * self.amp;
        self.phase += self.freq / self.sample_rate;
        if self.phase >= 1.0 {
            self.phase -= 1.0;
        }
        self.amp *= self.decay;
        sample as f32
    }

    /// Fill an interleaved buffer: one sample per frame, copied to every channel.
    pub fn fill(&mut self, data: &mut [f32], channels: usize) {
        for frame in data.chunks_mut(channels) {
            let sample = self.next();
            for out in frame.iter_mut() {
                *out = sample;
            }
        }
    }
}
