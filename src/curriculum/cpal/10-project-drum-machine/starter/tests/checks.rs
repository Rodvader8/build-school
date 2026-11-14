// These tests call your code in src/lib.rs. Read them, but don't edit them.
// They render sound into memory and a temp file. Nothing is played and no audio device is opened.
use cpal_10_drums::*;

fn peak(samples: &[f32]) -> f32 {
    samples.iter().fold(0.0_f32, |m, s| m.max(s.abs()))
}

fn bar(pattern: &Pattern) -> Vec<f32> {
    render_offline(pattern, 120.0, 44_100.0, 1)
}

#[test]
fn a_step_is_a_sixteenth_note_long() {
    assert_eq!(samples_per_step(120.0, 44_100.0), 5_512.5);
    assert_eq!(samples_per_step(60.0, 48_000.0), 12_000.0);
    assert_eq!(samples_per_step(150.0, 48_000.0), 4_800.0);
}

#[test]
fn steps_can_be_toggled_on_and_off() {
    let mut pattern = Pattern::new();
    assert!(!pattern.is_on(0, 4));
    pattern.toggle(0, 4);
    assert!(pattern.is_on(0, 4));
    assert!(!pattern.is_on(1, 4), "other lanes are untouched");
    assert!(!pattern.is_on(0, 5), "other steps are untouched");
    pattern.toggle(0, 4);
    assert!(!pattern.is_on(0, 4));
}

#[test]
fn an_empty_pattern_is_perfectly_silent() {
    let out = bar(&Pattern::new());
    assert_eq!(out.len(), 88_200);
    assert!(out.iter().all(|&s| s == 0.0));
}

#[test]
fn a_kick_on_step_zero_sounds_straight_away_and_dies_away() {
    let out = bar(&Pattern::from_strings(["x...............", "................", "................"]));
    assert!(peak(&out[..1_000]) > 0.3, "the kick should start on the very first frames");
    assert!(peak(&out[44_100..]) < 0.01, "and be long gone by the second half of the bar");
}

#[test]
fn hits_land_on_the_steps_they_are_written_on() {
    let out = bar(&Pattern::from_strings(["x.......x.......", "................", "................"]));
    assert!(peak(&out[0..500]) > 0.3, "step 0");
    assert!(peak(&out[44_100..44_600]) > 0.3, "step 8 starts at frame 44100 (half a bar at 120 bpm)");
    assert!(peak(&out[22_100..22_600]) < 0.05, "step 4 is empty");
}

#[test]
fn the_machine_counts_the_steps_it_has_played() {
    let mut machine = DrumMachine::new(Pattern::new(), 120.0, 44_100.0);
    assert_eq!(machine.steps_played(), 0);
    let mut out = vec![0.0_f32; 88_200];
    machine.render(&mut out, 1);
    assert_eq!(machine.steps_played(), 16);
    assert_eq!(machine.current_step(), 15);
    machine.render(&mut out, 1);
    assert_eq!(machine.steps_played(), 32);
    assert_eq!(machine.current_step(), 15, "the pattern loops every 16 steps");
}

#[test]
fn rendering_in_small_buffers_sounds_the_same_as_one_big_one() {
    let pattern = Pattern::from_strings(["x...x...x...x...", "....x.......x...", "x.x.x.x.x.x.x.xx"]);
    let whole = render_offline(&pattern, 120.0, 44_100.0, 1);
    let mut machine = DrumMachine::new(pattern, 120.0, 44_100.0);
    let mut pieces = Vec::new();
    for size in [1, 7, 64, 333].iter().cycle().take(400) {
        let mut buffer = vec![0.0_f32; *size];
        machine.render(&mut buffer, 1);
        pieces.extend(buffer);
        if pieces.len() >= whole.len() {
            break;
        }
    }
    for (i, (a, b)) in whole.iter().zip(&pieces).enumerate() {
        assert!((a - b).abs() < 1e-6, "differs at frame {i}");
    }
}

#[test]
fn every_lane_on_every_step_still_never_clips() {
    let full = Pattern::from_strings(["xxxxxxxxxxxxxxxx"; 3]);
    let out = render_offline(&full, 120.0, 44_100.0, 2);
    assert!(peak(&out) > 0.5, "it should be loud");
    assert!(peak(&out) <= 1.0, "but never past full scale: peak was {}", peak(&out));
}

#[test]
fn stereo_output_repeats_the_mix_in_both_channels() {
    let pattern = Pattern::from_strings(["x...............", "x...............", "x..............."]);
    let mut machine = DrumMachine::new(pattern, 120.0, 44_100.0);
    let mut out = vec![0.0_f32; 2_000];
    machine.render(&mut out, 2);
    assert!(out.chunks(2).all(|f| f[0] == f[1]));
    assert!(peak(&out) > 0.3);
}

#[test]
fn render_offline_gives_whole_bars() {
    let pattern = Pattern::new();
    assert_eq!(render_offline(&pattern, 120.0, 44_100.0, 2).len(), 176_400);
    assert_eq!(render_offline(&pattern, 100.0, 48_000.0, 1).len(), 115_200);
}

#[test]
fn a_rendered_beat_can_be_saved_as_a_wav_file() {
    let pattern = Pattern::from_strings(["x...x...x...x...", "....x.......x...", "x.x.x.x.x.x.x.xx"]);
    let samples = render_offline(&pattern, 120.0, 44_100.0, 1);
    let path = std::env::temp_dir().join(format!("build_school_cpal10_{}.wav", std::process::id()));
    write_wav(&path, &samples, 44_100).unwrap();

    let reader = hound::WavReader::open(&path).unwrap();
    let spec = reader.spec();
    assert_eq!((spec.channels, spec.sample_rate, spec.bits_per_sample), (1, 44_100, 16));
    let back: Vec<f32> = reader.into_samples::<i16>().map(|s| s.unwrap() as f32 / 32768.0).collect();
    assert_eq!(back.len(), samples.len());
    assert!(back.iter().zip(&samples).all(|(a, b)| (a - b).abs() < 1e-3));
    std::fs::remove_file(path).ok();
}
