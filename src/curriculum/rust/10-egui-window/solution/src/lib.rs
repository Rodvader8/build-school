// Lesson 10: the app's state and rules. No window code lives here, so it's easy to test.

pub struct Mixer {
    pub volume: f32, // 0.0 to 1.0
    pub muted: bool,
    pub tempo: u32, // beats per minute, 40 to 240
}

impl Mixer {
    /// 80% volume, unmuted, 120 bpm.
    pub fn new() -> Mixer {
        Mixer { volume: 0.8, muted: false, tempo: 120 }
    }

    /// Sets the volume, clamped between 0.0 and 1.0.
    pub fn set_volume(&mut self, v: f32) {
        self.volume = v.clamp(0.0, 1.0);
    }

    /// Flips `muted`.
    pub fn toggle_mute(&mut self) {
        self.muted = !self.muted;
    }

    /// 0.0 when muted, otherwise the volume.
    pub fn output_gain(&self) -> f32 {
        if self.muted { 0.0 } else { self.volume }
    }

    /// Adds `delta` to the tempo, but never below 40 or above 240.
    pub fn nudge_tempo(&mut self, delta: i32) {
        self.tempo = (self.tempo as i32 + delta).clamp(40, 240) as u32;
    }

    /// "Muted", or the volume as a percentage.
    pub fn level_label(&self) -> String {
        if self.muted {
            String::from("Muted")
        } else {
            format!("{}%", (self.volume * 100.0).round() as u32)
        }
    }
}
