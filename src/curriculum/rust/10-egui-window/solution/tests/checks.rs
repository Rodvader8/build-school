// A window can't open during a test, so these check the app's logic, which lives in src/lib.rs.
// Read them, but don't edit them.
use rust_10_egui::Mixer;

#[test]
fn a_new_mixer_starts_at_80_percent_unmuted_at_120_bpm() {
    let mixer = Mixer::new();
    assert_eq!(mixer.volume, 0.8);
    assert!(!mixer.muted);
    assert_eq!(mixer.tempo, 120);
}

#[test]
fn set_volume_stays_between_0_and_1() {
    let mut mixer = Mixer::new();
    mixer.set_volume(0.5);
    assert_eq!(mixer.volume, 0.5);
    mixer.set_volume(3.0);
    assert_eq!(mixer.volume, 1.0);
    mixer.set_volume(-2.0);
    assert_eq!(mixer.volume, 0.0);
}

#[test]
fn toggle_mute_flips_and_flips_back() {
    let mut mixer = Mixer::new();
    mixer.toggle_mute();
    assert!(mixer.muted);
    mixer.toggle_mute();
    assert!(!mixer.muted);
}

#[test]
fn output_gain_is_silent_when_muted() {
    let mut mixer = Mixer::new();
    mixer.set_volume(0.5);
    assert_eq!(mixer.output_gain(), 0.5);
    mixer.toggle_mute();
    assert_eq!(mixer.output_gain(), 0.0);
}

#[test]
fn nudge_tempo_stops_at_40_and_240() {
    let mut mixer = Mixer::new();
    mixer.nudge_tempo(10);
    assert_eq!(mixer.tempo, 130);
    mixer.nudge_tempo(500);
    assert_eq!(mixer.tempo, 240);
    mixer.nudge_tempo(-1000);
    assert_eq!(mixer.tempo, 40);
}

#[test]
fn the_label_shows_a_percentage_or_muted() {
    let mut mixer = Mixer::new();
    assert_eq!(mixer.level_label(), "80%");
    mixer.toggle_mute();
    assert_eq!(mixer.level_label(), "Muted");
}
