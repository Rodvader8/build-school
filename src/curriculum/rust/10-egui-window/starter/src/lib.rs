// Lesson 10: the app's state and rules. No window code lives here, so it's easy to test.
// Replace each todo!() with real code.

pub struct Mixer {
    pub volume: f32, // 0.0 to 1.0
    pub muted: bool,
    pub tempo: u32, // beats per minute, 40 to 240
}

impl Mixer {
    /// Written for you: 80% volume, unmuted, 120 bpm. Keeps the window openable while you work.
    pub fn new() -> Mixer {
        Mixer { volume: 0.8, muted: false, tempo: 120 }
    }

    /// Sets the volume, clamped between 0.0 and 1.0. Hint: v.clamp(0.0, 1.0)
    pub fn set_volume(&mut self, v: f32) {
        todo!()
    }

    /// Flips `muted`.
    pub fn toggle_mute(&mut self) {
        todo!()
    }

    /// 0.0 when muted, otherwise the volume. This is the number you'd hand to the audio thread.
    pub fn output_gain(&self) -> f32 {
        todo!()
    }

    /// Adds `delta` to the tempo, but never below 40 or above 240.
    /// Hint: convert to i32 for the sum (delta can be negative), clamp, then convert back with `as u32`.
    pub fn nudge_tempo(&mut self, delta: i32) {
        todo!()
    }

    /// "Muted" when muted, otherwise the volume as a whole-number percentage, like "80%".
    pub fn level_label(&self) -> String {
        todo!()
    }
}
