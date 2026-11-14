// These tests call your code in src/lib.rs. Read them, but don't edit them.
use cpal_03_sine::*;

#[test]
fn the_first_sample_is_zero_and_the_wave_rises() {
    let mut sine = Sine::new(440.0, 44_100.0);
    assert_eq!(sine.next_sample(), 0.0);
    assert!(sine.next_sample() > 0.0);
}

#[test]
fn a_quarter_of_the_sample_rate_gives_zero_one_zero_minus_one() {
    let mut sine = Sine::new(12_000.0, 48_000.0);
    let samples: Vec<f32> = (0..4).map(|_| sine.next_sample()).collect();
    for (got, want) in samples.iter().zip([0.0, 1.0, 0.0, -1.0]) {
        assert!((got - want).abs() < 1e-3, "{samples:?}");
    }
}

#[test]
fn the_phase_always_stays_between_zero_and_one() {
    let mut sine = Sine::new(1_234.5, 48_000.0);
    for _ in 0..200_000 {
        sine.next_sample();
        assert!((0.0..1.0).contains(&sine.phase()), "phase escaped: {}", sine.phase());
    }
}

#[test]
fn fill_copies_each_sample_to_every_channel_and_applies_volume() {
    let mut sine = Sine::new(12_000.0, 48_000.0);
    let mut data = vec![9.0_f32; 8]; // 4 frames of stereo
    sine.fill(&mut data, 2, 0.5);
    let want = [0.0, 0.0, 0.5, 0.5, 0.0, 0.0, -0.5, -0.5];
    for (got, want) in data.iter().zip(want) {
        assert!((got - want).abs() < 1e-3, "{data:?}");
    }
}

#[test]
fn fill_carries_on_where_the_last_buffer_stopped() {
    let mut whole = Sine::new(440.0, 48_000.0);
    let mut one = vec![0.0_f32; 200];
    whole.fill(&mut one, 1, 1.0);

    let mut split = Sine::new(440.0, 48_000.0);
    let mut a = vec![0.0_f32; 73];
    let mut b = vec![0.0_f32; 127];
    split.fill(&mut a, 1, 1.0);
    split.fill(&mut b, 1, 1.0);
    a.extend(b);
    for (x, y) in one.iter().zip(&a) {
        assert!((x - y).abs() < 1e-5, "the wave jumped between buffers");
    }
}

#[test]
fn changing_frequency_does_not_reset_the_phase() {
    let mut sine = Sine::new(440.0, 48_000.0);
    for _ in 0..10 {
        sine.next_sample();
    }
    let before = sine.phase();
    sine.set_frequency(880.0);
    assert_eq!(sine.phase(), before);
    let expected = (before * std::f32::consts::TAU).sin();
    assert!((sine.next_sample() - expected).abs() < 1e-6);
}

#[test]
fn one_second_of_concert_a_crosses_zero_about_880_times() {
    let mut sine = Sine::new(440.0, 48_000.0);
    let mut crossings = 0;
    let mut previous = sine.next_sample();
    for _ in 1..48_000 {
        let current = sine.next_sample();
        if (previous < 0.0) != (current < 0.0) {
            crossings += 1;
        }
        previous = current;
    }
    assert!((crossings as i32 - 880).abs() <= 3, "{crossings} crossings");
}
