// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use cpal_01_samples::*;

#[test]
fn seconds_for_divides_frames_by_rate() {
    assert!((seconds_for(48_000, 48_000) - 1.0).abs() < 1e-6);
    assert!((seconds_for(24_000, 48_000) - 0.5).abs() < 1e-6);
    assert!((seconds_for(441, 44_100) - 0.01).abs() < 1e-6);
}

#[test]
fn frames_for_rounds_to_whole_frames() {
    assert_eq!(frames_for(1.0, 48_000), 48_000);
    assert_eq!(frames_for(0.5, 44_100), 22_050);
    assert_eq!(frames_for(0.01, 44_100), 441);
    assert_eq!(frames_for(0.0, 44_100), 0);
}

#[test]
fn latency_is_the_buffer_length_in_milliseconds() {
    assert!((latency_ms(512, 48_000) - 10.6667).abs() < 0.001);
    assert!((latency_ms(256, 44_100) - 5.805).abs() < 0.001);
    assert!((latency_ms(48_000, 48_000) - 1000.0).abs() < 0.001);
}

#[test]
fn interleave_mono_repeats_each_sample_per_channel() {
    assert_eq!(interleave_mono(&[0.1, 0.2], 2), vec![0.1, 0.1, 0.2, 0.2]);
    assert_eq!(interleave_mono(&[0.5, -0.5], 1), vec![0.5, -0.5]);
    assert_eq!(interleave_mono(&[1.0], 3), vec![1.0, 1.0, 1.0]);
    assert!(interleave_mono(&[], 2).is_empty());
}

#[test]
fn fill_ramp_gives_every_channel_in_a_frame_the_same_value() {
    let mut buffer = vec![9.0_f32; 8];
    fill_ramp(&mut buffer, 2);
    assert_eq!(buffer, vec![0.0, 0.0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75]);
    let mut mono = vec![9.0_f32; 4];
    fill_ramp(&mut mono, 1);
    assert_eq!(mono, vec![0.0, 0.25, 0.5, 0.75]);
}
