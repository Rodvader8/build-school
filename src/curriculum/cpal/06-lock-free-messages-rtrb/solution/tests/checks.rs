// These tests call your code in src/lib.rs. Read them, but don't edit them.
use cpal_06_messages::*;
use std::time::{Duration, Instant};

fn peak(samples: &[f32]) -> f32 {
    samples.iter().fold(0.0_f32, |m, s| m.max(s.abs()))
}

fn close(a: &[f32], b: &[f32]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| (x - y).abs() < 1e-3)
}

#[test]
fn send_says_false_when_the_queue_is_full_instead_of_waiting() {
    let (mut handle, _state) = channel(2, 48_000.0);
    assert!(handle.send(Command::NoteOff));
    assert!(handle.send(Command::NoteOff));
    assert!(!handle.send(Command::NoteOff));
}

#[test]
fn note_on_makes_sound_and_note_off_stops_it() {
    let (mut handle, mut state) = channel(16, 48_000.0);
    let mut out = vec![9.0_f32; 4];
    state.render(&mut out, 1);
    assert_eq!(out, vec![0.0; 4], "silent until told otherwise");
    assert!(!state.is_playing());

    handle.send(Command::NoteOn { freq: 12_000.0 });
    state.render(&mut out, 1);
    assert!(state.is_playing());
    assert!(close(&out, &[0.0, 1.0, 0.0, -1.0]), "{out:?}");

    handle.send(Command::NoteOff);
    state.render(&mut out, 1);
    assert!(!state.is_playing());
    assert_eq!(out, vec![0.0; 4]);
}

#[test]
fn set_gain_changes_the_volume() {
    let (mut handle, mut state) = channel(16, 48_000.0);
    handle.send(Command::NoteOn { freq: 12_000.0 });
    handle.send(Command::SetGain(0.5));
    let mut out = vec![0.0_f32; 8]; // 4 stereo frames
    state.render(&mut out, 2);
    assert!((peak(&out) - 0.5).abs() < 1e-3, "{out:?}");
    assert_eq!(out[2], out[3], "both channels carry the same sample");
}

#[test]
fn every_waiting_message_is_applied_before_the_buffer_is_filled() {
    let (mut handle, mut state) = channel(16, 48_000.0);
    handle.send(Command::SetGain(0.2));
    handle.send(Command::SetGain(0.4));
    handle.send(Command::NoteOn { freq: 12_000.0 });
    handle.send(Command::SetGain(0.8));
    let mut out = vec![0.0_f32; 4];
    state.render(&mut out, 1);
    assert!((peak(&out) - 0.8).abs() < 1e-3, "the last SetGain should win: {out:?}");
    assert_eq!(state.gain(), 0.8);
}

#[test]
fn messages_are_handled_in_the_order_they_were_sent() {
    let (mut handle, mut state) = channel(16, 48_000.0);
    handle.send(Command::NoteOn { freq: 440.0 });
    handle.send(Command::NoteOff);
    state.render(&mut [0.0; 4], 1);
    assert!(!state.is_playing(), "on then off should end silent");

    handle.send(Command::NoteOff);
    handle.send(Command::NoteOn { freq: 440.0 });
    state.render(&mut [0.0; 4], 1);
    assert!(state.is_playing(), "off then on should end playing");
}

#[test]
fn a_producer_thread_can_talk_to_the_audio_state() {
    let (mut handle, mut state) = channel(8, 48_000.0);
    let sender = std::thread::spawn(move || {
        for message in [Command::NoteOn { freq: 220.0 }, Command::SetGain(0.75)] {
            while !handle.send(message) {
                std::thread::yield_now();
            }
        }
        // a flood, to prove a small queue copes when the receiver keeps draining it
        for i in 0..5_000 {
            while !handle.send(Command::SetGain(0.5 + (i % 2) as f32 * 0.25)) {
                std::thread::yield_now();
            }
        }
    });
    let deadline = Instant::now() + Duration::from_secs(10);
    let mut out = [0.0_f32; 64];
    while !sender.is_finished() && Instant::now() < deadline {
        state.render(&mut out, 1);
    }
    sender.join().unwrap();
    state.render(&mut out, 1);
    assert!(state.is_playing());
    assert!(state.gain() == 0.5 || state.gain() == 0.75, "gain was {}", state.gain());
}
