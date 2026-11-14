// Lesson 8: MIDI input with midir, and MIDI files with midly.
use midly::{MidiMessage, Smf, TrackEventKind};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MidiEvent {
    NoteOn { note: u8, velocity: f32 },
    NoteOff { note: u8 },
    ControlChange { controller: u8, value: f32 },
    PitchBend(f32),
}

/// Parse one raw MIDI message, as midir delivers it. None for anything we don't handle.
pub fn parse_midi(bytes: &[u8]) -> Option<MidiEvent> {
    let (&status, data) = bytes.split_first()?;
    if status < 0x80 || data.len() < 2 || data[..2].iter().any(|&b| b > 0x7F) {
        return None;
    }
    let (a, b) = (data[0], data[1]);
    match status & 0xF0 {
        0x80 => Some(MidiEvent::NoteOff { note: a }),
        0x90 if b == 0 => Some(MidiEvent::NoteOff { note: a }),
        0x90 => Some(MidiEvent::NoteOn { note: a, velocity: b as f32 / 127.0 }),
        0xB0 => Some(MidiEvent::ControlChange { controller: a, value: b as f32 / 127.0 }),
        0xE0 => {
            let raw = ((b as i32) << 7) | a as i32;
            Some(MidiEvent::PitchBend((raw - 8192) as f32 / 8192.0))
        }
        _ => None,
    }
}

/// The frequency of a MIDI note number. Note 69 is A4 = 440 Hz, and every 12 notes doubles it.
pub fn note_to_freq(note: u8) -> f32 {
    440.0 * 2.0_f32.powf((note as f32 - 69.0) / 12.0)
}

/// Every note that starts in a MIDI file, as (time in ticks from the start, note number), earliest first.
/// A note-on with velocity 0 is a note-off, so it doesn't count.
pub fn notes_in_file(bytes: &[u8]) -> Result<Vec<(u32, u8)>, midly::Error> {
    let smf = Smf::parse(bytes)?;
    let mut notes = Vec::new();
    for track in &smf.tracks {
        let mut tick = 0_u32;
        for event in track {
            tick += event.delta.as_int();
            if let TrackEventKind::Midi { message: MidiMessage::NoteOn { key, vel }, .. } = event.kind {
                if vel.as_int() > 0 {
                    notes.push((tick, key.as_int()));
                }
            }
        }
    }
    notes.sort_by_key(|&(tick, _)| tick);
    Ok(notes)
}
