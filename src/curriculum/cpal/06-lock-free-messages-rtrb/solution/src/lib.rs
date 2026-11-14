// Lesson 6: lock-free messages with rtrb. The UI thread sends commands; the audio thread drains them.
use rtrb::{Consumer, Producer, RingBuffer};
use std::f32::consts::TAU;

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Command {
    NoteOn { freq: f32 },
    NoteOff,
    SetGain(f32),
}

/// The UI thread's end of the queue.
pub struct Handle {
    producer: Producer<Command>,
}

impl Handle {
    /// Queue a command. Returns false (and drops it) if the queue is full. Never waits.
    pub fn send(&mut self, command: Command) -> bool {
        self.producer.push(command).is_ok()
    }
}

/// Everything the audio thread owns.
pub struct AudioState {
    commands: Consumer<Command>,
    sample_rate: f32,
    phase: f32,
    freq: f32,
    gain: f32,
    playing: bool,
}

impl AudioState {
    pub fn is_playing(&self) -> bool {
        self.playing
    }

    pub fn gain(&self) -> f32 {
        self.gain
    }

    /// Apply every command that's waiting, oldest first.
    pub fn drain_commands(&mut self) {
        while let Ok(command) = self.commands.pop() {
            match command {
                Command::NoteOn { freq } => {
                    self.freq = freq;
                    self.phase = 0.0;
                    self.playing = true;
                }
                Command::NoteOff => self.playing = false,
                Command::SetGain(gain) => self.gain = gain,
            }
        }
    }

    /// Handle messages first, then fill the interleaved buffer: a sine while playing, silence otherwise.
    pub fn render(&mut self, out: &mut [f32], channels: usize) {
        self.drain_commands();
        for frame in out.chunks_mut(channels) {
            let sample = if self.playing {
                let s = (self.phase * TAU).sin() * self.gain;
                self.phase += self.freq / self.sample_rate;
                if self.phase >= 1.0 {
                    self.phase -= 1.0;
                }
                s
            } else {
                0.0
            };
            for slot in frame.iter_mut() {
                *slot = sample;
            }
        }
    }
}

/// Make a queue holding up to `capacity` commands, and the two ends that use it.
pub fn channel(capacity: usize, sample_rate: f32) -> (Handle, AudioState) {
    let (producer, commands) = RingBuffer::new(capacity);
    let state = AudioState { commands, sample_rate, phase: 0.0, freq: 440.0, gain: 1.0, playing: false };
    (Handle { producer }, state)
}
