// Lesson 4: envelopes, and the click voice that Bramble's metronome uses. Replace each todo!() with real code.

/// The number to multiply the volume by every sample so that it falls to 1/e (about 37%) of itself
/// after `time_constant` seconds.
/// The formula is e raised to (-1 / (time_constant * sample_rate)). In Rust: `(-1.0 / (...)).exp()`.
pub fn decay_coefficient(time_constant: f64, sample_rate: f64) -> f64 {
    todo!()
}

/// A sine burst with an exponential decay.
pub struct ClickVoice {
    sample_rate: f64,
    phase: f64,
    freq: f64,
    amp: f64, // the envelope: the current volume, shrinking every sample
    decay: f64,
}

impl ClickVoice {
    pub fn new(sample_rate: f64) -> Self {
        // Bramble's click has a 25 ms time constant (0.025 seconds). It starts silent: amp 0.
        ClickVoice { sample_rate, phase: 0.0, freq: 880.0, amp: 0.0, decay: decay_coefficient(0.025, sample_rate) }
    }

    /// Start a click. A downbeat is an octave higher (1760 Hz) and louder (amp 0.5);
    /// a normal beat is 880 Hz at amp 0.35. Restart the phase at 0.0 every time.
    pub fn trigger(&mut self, downbeat: bool) {
        todo!()
    }

    /// True while the click is still audible: the envelope is at or above 0.0001.
    pub fn is_active(&self) -> bool {
        todo!()
    }

    /// The next sample. When it isn't active, return 0.0 straight away.
    /// Otherwise: sample = sin(phase * TAU) * amp, then advance the phase (wrapping at 1.0, like lesson 3),
    /// then shrink amp by multiplying it by `decay`.
    pub fn next(&mut self) -> f32 {
        todo!()
    }

    /// Fill an interleaved buffer: one sample per frame, copied to every channel.
    pub fn fill(&mut self, data: &mut [f32], channels: usize) {
        todo!()
    }
}
