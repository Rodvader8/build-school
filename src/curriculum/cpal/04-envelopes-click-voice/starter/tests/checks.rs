// These tests call your code in src/lib.rs. Read them, but don't edit them.
use cpal_04_envelopes::*;

const SR: f64 = 48_000.0;

fn render(voice: &mut ClickVoice, frames: usize) -> Vec<f32> {
    (0..frames).map(|_| voice.next()).collect()
}

fn peak(samples: &[f32]) -> f32 {
    samples.iter().fold(0.0_f32, |m, s| m.max(s.abs()))
}

fn crossings(samples: &[f32]) -> usize {
    samples.windows(2).filter(|w| (w[0] < 0.0) != (w[1] < 0.0)).count()
}

#[test]
fn the_decay_coefficient_shrinks_to_one_over_e_after_one_time_constant() {
    let tau = 0.025;
    let c = decay_coefficient(tau, SR);
    assert!(c > 0.0 && c < 1.0);
    let after_one_tau = c.powf(tau * SR);
    assert!((after_one_tau - (-1.0_f64).exp()).abs() < 1e-6, "{after_one_tau}");
}

#[test]
fn a_new_voice_is_silent() {
    let mut voice = ClickVoice::new(SR);
    assert!(!voice.is_active());
    assert!(render(&mut voice, 100).iter().all(|&s| s == 0.0));
}

#[test]
fn a_normal_click_peaks_near_0_35_and_a_downbeat_near_0_5() {
    let mut voice = ClickVoice::new(SR);
    voice.trigger(false);
    assert!(voice.is_active());
    let normal = peak(&render(&mut voice, 200));
    assert!(normal > 0.30 && normal < 0.36, "normal peak {normal}");

    voice.trigger(true);
    let downbeat = peak(&render(&mut voice, 200));
    assert!(downbeat > 0.45 && downbeat <= 0.5, "downbeat peak {downbeat}");
}

#[test]
fn the_downbeat_is_an_octave_higher() {
    let mut low = ClickVoice::new(SR);
    low.trigger(false);
    let low_crossings = crossings(&render(&mut low, 480));
    let mut high = ClickVoice::new(SR);
    high.trigger(true);
    let high_crossings = crossings(&render(&mut high, 480));
    assert!(high_crossings as f32 > low_crossings as f32 * 1.7, "{low_crossings} vs {high_crossings}");
}

#[test]
fn the_click_fades_out_and_then_switches_itself_off() {
    let mut voice = ClickVoice::new(SR);
    voice.trigger(false);
    let early = peak(&render(&mut voice, 200));
    render(&mut voice, 2_200);
    let later = peak(&render(&mut voice, 200)); // about two time constants in
    assert!(later < early / 3.0, "{later} should be well under {early}");
    render(&mut voice, 12_000);
    assert!(!voice.is_active());
    assert!(render(&mut voice, 100).iter().all(|&s| s == 0.0));
}

#[test]
fn every_trigger_starts_from_zero_at_full_strength() {
    let mut voice = ClickVoice::new(SR);
    voice.trigger(false);
    render(&mut voice, 5_000); // part way through the fade
    voice.trigger(false);
    assert_eq!(voice.next(), 0.0, "a new click should start at phase 0, with no jump");
    let again = peak(&render(&mut voice, 200));
    assert!(again > 0.30, "the second click should be back at full strength, got {again}");
}

#[test]
fn fill_writes_one_sample_per_frame_to_every_channel() {
    let mut voice = ClickVoice::new(SR);
    voice.trigger(true);
    let mut data = vec![9.0_f32; 40]; // 20 stereo frames
    voice.fill(&mut data, 2);
    for frame in data.chunks(2) {
        assert_eq!(frame[0], frame[1]);
    }
    assert!(peak(&data) > 0.1);
    assert!(data.iter().all(|s| s.abs() <= 0.5));
}
