// These tests call your code in src/lib.rs. Read them, but don't edit them.
// They feed in raw MIDI bytes and a MIDI file built in memory. No MIDI device is opened.
use cpal_08_midi::*;
use midly::{Format, Header, MetaMessage, MidiMessage, Smf, Timing, TrackEvent, TrackEventKind};

fn near(a: f32, b: f32) -> bool {
    (a - b).abs() < 1e-3
}

#[test]
fn note_on_messages_carry_the_note_and_a_velocity_from_0_to_1() {
    match parse_midi(&[0x90, 60, 127]) {
        Some(MidiEvent::NoteOn { note: 60, velocity }) => assert!(near(velocity, 1.0)),
        other => panic!("expected NoteOn, got {other:?}"),
    }
    // The channel (the low 4 bits of the first byte) is ignored: this is channel 4.
    match parse_midi(&[0x93, 40, 64]) {
        Some(MidiEvent::NoteOn { note: 40, velocity }) => assert!(near(velocity, 64.0 / 127.0)),
        other => panic!("expected NoteOn, got {other:?}"),
    }
}

#[test]
fn a_note_on_with_velocity_zero_means_note_off() {
    assert_eq!(parse_midi(&[0x90, 60, 0]), Some(MidiEvent::NoteOff { note: 60 }));
}

#[test]
fn note_off_messages_are_parsed() {
    assert_eq!(parse_midi(&[0x80, 72, 64]), Some(MidiEvent::NoteOff { note: 72 }));
    assert_eq!(parse_midi(&[0x8F, 12, 0]), Some(MidiEvent::NoteOff { note: 12 }));
}

#[test]
fn control_changes_give_a_value_from_0_to_1() {
    match parse_midi(&[0xB0, 1, 127]) {
        Some(MidiEvent::ControlChange { controller: 1, value }) => assert!(near(value, 1.0)),
        other => panic!("expected ControlChange, got {other:?}"),
    }
    match parse_midi(&[0xB1, 64, 0]) {
        Some(MidiEvent::ControlChange { controller: 64, value }) => assert!(near(value, 0.0)),
        other => panic!("expected ControlChange, got {other:?}"),
    }
}

#[test]
fn pitch_bend_joins_two_7_bit_halves_into_minus_one_to_one() {
    // The first data byte is the low 7 bits, the second is the high 7 bits. Centre is 8192.
    match parse_midi(&[0xE0, 0x00, 0x40]) {
        Some(MidiEvent::PitchBend(v)) => assert!(near(v, 0.0), "centre was {v}"),
        other => panic!("expected PitchBend, got {other:?}"),
    }
    match parse_midi(&[0xE0, 0x00, 0x00]) {
        Some(MidiEvent::PitchBend(v)) => assert!(near(v, -1.0), "bottom was {v}"),
        other => panic!("expected PitchBend, got {other:?}"),
    }
    match parse_midi(&[0xE0, 0x7F, 0x7F]) {
        Some(MidiEvent::PitchBend(v)) => assert!(v > 0.99 && v <= 1.0, "top was {v}"),
        other => panic!("expected PitchBend, got {other:?}"),
    }
}

#[test]
fn short_or_unknown_messages_are_ignored() {
    assert_eq!(parse_midi(&[]), None);
    assert_eq!(parse_midi(&[0x90]), None);
    assert_eq!(parse_midi(&[0x90, 60]), None);
    assert_eq!(parse_midi(&[0xF8]), None); // timing clock
    assert_eq!(parse_midi(&[0xC0, 5]), None); // program change isn't handled here
    assert_eq!(parse_midi(&[0x40, 1, 2]), None); // doesn't start with a status byte
}

#[test]
fn note_numbers_become_frequencies() {
    assert!(near(note_to_freq(69), 440.0));
    assert!(near(note_to_freq(81), 880.0));
    assert!(near(note_to_freq(57), 220.0));
    assert!((note_to_freq(60) - 261.6256).abs() < 0.01);
}

fn event(delta: u32, message: MidiMessage) -> TrackEvent<'static> {
    TrackEvent { delta: delta.into(), kind: TrackEventKind::Midi { channel: 0.into(), message } }
}

fn on(key: u8, vel: u8) -> MidiMessage {
    MidiMessage::NoteOn { key: key.into(), vel: vel.into() }
}

fn off(key: u8) -> MidiMessage {
    MidiMessage::NoteOff { key: key.into(), vel: 0.into() }
}

#[test]
fn notes_in_file_lists_each_note_with_its_time_in_ticks() {
    let mut smf = Smf::new(Header::new(Format::SingleTrack, Timing::Metrical(480.into())));
    smf.tracks.push(vec![
        event(0, on(60, 100)),
        event(480, off(60)),
        event(0, on(64, 90)), // tick 480
        event(240, on(64, 0)), // a velocity-0 note-on is an off, not a new note
        event(240, on(67, 80)), // tick 960
        event(480, off(67)),
        TrackEvent { delta: 0.into(), kind: TrackEventKind::Meta(MetaMessage::EndOfTrack) },
    ]);
    let mut bytes = Vec::new();
    smf.write(&mut bytes).unwrap();
    assert_eq!(notes_in_file(&bytes).unwrap(), vec![(0, 60), (480, 64), (960, 67)]);
}

#[test]
fn notes_from_several_tracks_come_back_sorted_by_time() {
    let mut smf = Smf::new(Header::new(Format::Parallel, Timing::Metrical(96.into())));
    smf.tracks.push(vec![event(0, on(48, 100)), event(192, on(50, 100))]);
    smf.tracks.push(vec![event(96, on(72, 100)), event(96, on(74, 100))]);
    let mut bytes = Vec::new();
    smf.write(&mut bytes).unwrap();
    assert_eq!(notes_in_file(&bytes).unwrap(), vec![(0, 48), (96, 72), (192, 50), (192, 74)]);
}

#[test]
fn bytes_that_are_not_a_midi_file_give_an_error() {
    assert!(notes_in_file(b"definitely not a midi file").is_err());
}
