// Lesson 10 project: a tiny drum machine. The sequencer is yours; the drum voices are written for you.
use std::f32::consts::TAU;

pub const STEPS: usize = 16;
pub const LANES: usize = 3; // 0 = kick, 1 = snare, 2 = hi-hat

/// Which steps are switched on in each lane.
#[derive(Clone, Debug, PartialEq)]
pub struct Pattern {
    steps: [[bool; STEPS]; LANES],
}

impl Pattern {
    /// Start from a drawing: one string of 16 characters per lane, "x" for a hit and anything else for a rest.
    pub fn from_strings(rows: [&str; LANES]) -> Pattern {
        let mut pattern = Pattern::new();
        for (lane, row) in rows.iter().enumerate() {
            for (step, ch) in row.chars().take(STEPS).enumerate() {
                pattern.steps[lane][step] = ch == 'x';
            }
        }
        pattern
    }
}

// ---- The three drum voices. These are written for you: they are lesson 4 (envelopes) with a few extras. ----

#[derive(Clone, Copy)]
enum Kind {
    Kick,
    Snare,
    Hat,
}

/// A drum voice: trigger() starts it, next() gives one sample, and it switches itself off when it has faded out.
pub struct Voice {
    kind: Kind,
    sample_rate: f32,
    phase: f32,
    age: f32, // seconds since the hit
    start: f32,
    amp: f32,
    decay: f32,
    noise: u32,
    last_noise: f32,
}

impl Voice {
    fn new(kind: Kind, sample_rate: f32, start: f32, time_constant: f32) -> Voice {
        Voice { kind, sample_rate, phase: 0.0, age: 0.0, start, amp: 0.0, decay: (-1.0 / (time_constant * sample_rate)).exp(), noise: 12345, last_noise: 0.0 }
    }
    pub fn kick(sample_rate: f32) -> Voice {
        Voice::new(Kind::Kick, sample_rate, 0.9, 0.12)
    }
    pub fn snare(sample_rate: f32) -> Voice {
        Voice::new(Kind::Snare, sample_rate, 0.7, 0.07)
    }
    pub fn hat(sample_rate: f32) -> Voice {
        Voice::new(Kind::Hat, sample_rate, 0.4, 0.025)
    }

    pub fn trigger(&mut self) {
        self.phase = 0.0;
        self.age = 0.0;
        self.amp = self.start;
    }

    fn white(&mut self) -> f32 {
        // A tiny repeatable random number generator: no allocation, no locks, the same noise every run.
        self.noise = self.noise.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
        (self.noise >> 8) as f32 / 8_388_608.0 - 1.0
    }

    pub fn next(&mut self) -> f32 {
        if self.amp < 1e-4 {
            return 0.0;
        }
        let raw = match self.kind {
            Kind::Kick => {
                let freq = 50.0 + 100.0 * (-self.age * 30.0).exp(); // a pitch that drops from 150 Hz to 50 Hz
                self.phase = (self.phase + freq / self.sample_rate) % 1.0;
                (self.phase * TAU).sin()
            }
            Kind::Snare => {
                self.phase = (self.phase + 180.0 / self.sample_rate) % 1.0;
                0.6 * self.white() + 0.4 * (self.phase * TAU).sin()
            }
            Kind::Hat => {
                let n = self.white();
                let bright = n - self.last_noise; // subtracting the last sample keeps only the high frequencies
                self.last_noise = n;
                bright * 0.5
            }
        };
        self.age += 1.0 / self.sample_rate;
        let out = raw * self.amp;
        self.amp *= self.decay;
        out
    }
}

impl Pattern {
    pub fn new() -> Pattern {
        Pattern { steps: [[false; STEPS]; LANES] }
    }

    /// Flip one step on or off.
    pub fn toggle(&mut self, lane: usize, step: usize) {
        self.steps[lane][step] = !self.steps[lane][step];
    }

    pub fn is_on(&self, lane: usize, step: usize) -> bool {
        self.steps[lane][step]
    }
}

impl Default for Pattern {
    fn default() -> Self {
        Pattern::new()
    }
}

/// The length of one step, in frames. A step is a sixteenth note: a quarter of a beat.
pub fn samples_per_step(bpm: f32, sample_rate: f32) -> f32 {
    60.0 / bpm / 4.0 * sample_rate
}

pub struct DrumMachine {
    pattern: Pattern,
    voices: [Voice; LANES],
    sample_rate: f32,
    bpm: f32,
    steps_played: usize,
    until_next: f32, // frames left before the next step fires (0.0 at the start, so step 0 fires on the first frame)
}

impl DrumMachine {
    pub fn new(pattern: Pattern, bpm: f32, sample_rate: f32) -> Self {
        DrumMachine {
            pattern,
            voices: [Voice::kick(sample_rate), Voice::snare(sample_rate), Voice::hat(sample_rate)],
            sample_rate,
            bpm,
            steps_played: 0,
            until_next: 0.0,
        }
    }

    /// How many steps have fired so far, over all loops.
    pub fn steps_played(&self) -> usize {
        self.steps_played
    }

    /// The pattern position (0 to 15) of the most recent step. Only meaningful once a step has played.
    pub fn current_step(&self) -> usize {
        self.steps_played.saturating_sub(1) % STEPS
    }

    /// One frame of the mixed sound.
    pub fn next_frame(&mut self) -> f32 {
        if self.until_next <= 0.0 {
            let step = self.steps_played % STEPS;
            for lane in 0..LANES {
                if self.pattern.is_on(lane, step) {
                    self.voices[lane].trigger();
                }
            }
            self.steps_played += 1;
            self.until_next += samples_per_step(self.bpm, self.sample_rate);
        }
        self.until_next -= 1.0;
        self.voices.iter_mut().map(|voice| voice.next()).sum()
    }

    /// Fill an interleaved buffer. Each frame is the mix, kept inside -1.0 to 1.0, copied to every channel.
    pub fn render(&mut self, out: &mut [f32], channels: usize) {
        for frame in out.chunks_mut(channels) {
            let sample = self.next_frame().clamp(-1.0, 1.0);
            for slot in frame.iter_mut() {
                *slot = sample;
            }
        }
    }
}

/// Render `bars` bars (16 steps each) of the pattern into a mono Vec, without playing anything.
pub fn render_offline(pattern: &Pattern, bpm: f32, sample_rate: f32, bars: usize) -> Vec<f32> {
    let mut machine = DrumMachine::new(pattern.clone(), bpm, sample_rate);
    let frames = (bars as f32 * STEPS as f32 * samples_per_step(bpm, sample_rate)).round() as usize;
    let mut out = vec![0.0_f32; frames];
    machine.render(&mut out, 1);
    out
}

/// Save mono samples as a 16-bit WAV file.
pub fn write_wav(path: &std::path::Path, samples: &[f32], sample_rate: u32) -> Result<(), hound::Error> {
    let spec = hound::WavSpec { channels: 1, sample_rate, bits_per_sample: 16, sample_format: hound::SampleFormat::Int };
    let mut writer = hound::WavWriter::create(path, spec)?;
    for &sample in samples {
        writer.write_sample((sample.clamp(-1.0, 1.0) * i16::MAX as f32) as i16)?;
    }
    writer.finalize()
}
