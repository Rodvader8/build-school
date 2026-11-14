// Lesson 8: MIDI input with midir, and MIDI files with midly. Replace each todo!() with real code.
// Nothing here opens a device. You parse bytes that main.rs (or a test) hands you.
use midly::{MidiMessage, Smf, TrackEventKind};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MidiEvent {
    NoteOn { note: u8, velocity: f32 },
    NoteOff { note: u8 },
    ControlChange { controller: u8, value: f32 },
    PitchBend(f32),
}

/// Parse one raw MIDI message, as midir delivers it: [status, data1, data2].
/// The status byte's high 4 bits say what it is (0x80 note off, 0x90 note on, 0xB0 control change, 0xE0 pitch bend);
/// the low 4 bits are the channel, which we ignore: `status & 0xF0`.
/// - velocity and control values are 0 to 127: divide by 127.0 to get 0.0 to 1.0
/// - a note-on with velocity 0 is really a note-off
/// - pitch bend: raw = (data2 << 7) | data1, centre is 8192, so (raw - 8192) as f32 / 8192.0
/// Return None for empty or too-short messages, a first byte that isn't a status byte (under 0x80),
/// and anything else (clock, program change...).
pub fn parse_midi(bytes: &[u8]) -> Option<MidiEvent> {
    todo!()
}

/// The frequency of a MIDI note number. Note 69 is A4 = 440 Hz, and every 12 notes doubles it:
/// 440 * 2^((note - 69) / 12).
pub fn note_to_freq(note: u8) -> f32 {
    todo!()
}

/// Every note that starts in a MIDI file, as (time in ticks from the start, note number), earliest first.
/// A note-on with velocity 0 is a note-off, so it doesn't count.
/// Hint: `Smf::parse(bytes)?` gives `smf.tracks`, a list of tracks, each a list of events.
/// Each event has a `delta` (ticks since the previous event: add them up) and a `kind`. Match
/// `TrackEventKind::Midi { message: MidiMessage::NoteOn { key, vel }, .. }`. midly's numbers have `.as_int()`.
/// With several tracks, collect them all and `sort_by_key` the tick.
pub fn notes_in_file(bytes: &[u8]) -> Result<Vec<(u32, u8)>, midly::Error> {
    todo!()
}
