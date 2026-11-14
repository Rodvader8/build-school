// Lesson 6: lock-free messages with rtrb. The UI thread sends commands; the audio thread drains them.
// Replace each todo!() with real code.
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
    /// Hint: `self.producer.push(command)` gives a Result. `.is_ok()` turns it into a bool.
    pub fn send(&mut self, command: Command) -> bool {
        todo!()
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
    /// Hint: `while let Ok(command) = self.commands.pop() { match command { ... } }`
    /// NoteOn sets the frequency, restarts the phase at 0.0 and sets playing. NoteOff clears playing. SetGain stores the gain.
    pub fn drain_commands(&mut self) {
        todo!()
    }

    /// Handle messages first (call drain_commands), then fill the interleaved buffer with one sample per frame,
    /// copied to every channel: a sine at `gain` volume while playing, and 0.0 when not.
    pub fn render(&mut self, out: &mut [f32], channels: usize) {
        todo!()
    }
}

/// Make a queue holding up to `capacity` commands, and the two ends that use it.
/// Hint: `let (producer, commands) = RingBuffer::new(capacity);`
/// Start with freq 440.0, gain 1.0, phase 0.0 and playing false.
pub fn channel(capacity: usize, sample_rate: f32) -> (Handle, AudioState) {
    todo!()
}
