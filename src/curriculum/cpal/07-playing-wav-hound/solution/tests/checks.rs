// These tests call your code in src/lib.rs. Read them, but don't edit them.
// They write small .wav files to your temp folder, and never touch an audio device.
use cpal_07_wav::*;
use std::path::PathBuf;

fn temp(name: &str) -> PathBuf {
    std::env::temp_dir().join(format!("build_school_cpal07_{}_{name}.wav", std::process::id()))
}

fn close(a: &[f32], b: &[f32]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| (x - y).abs() < 1e-3)
}

#[test]
fn write_sine_wav_makes_a_16_bit_mono_file_of_the_right_length() {
    let path = temp("sine_format");
    write_sine_wav(&path, 440.0, 0.5, 44_100, 0.5).unwrap();
    let reader = hound::WavReader::open(&path).unwrap();
    let spec = reader.spec();
    assert_eq!(spec.channels, 1);
    assert_eq!(spec.sample_rate, 44_100);
    assert_eq!(spec.bits_per_sample, 16);
    assert_eq!(spec.sample_format, hound::SampleFormat::Int);
    let samples: Vec<i16> = reader.into_samples::<i16>().map(|s| s.unwrap()).collect();
    assert_eq!(samples.len(), 22_050);
    assert_eq!(samples[0], 0);
    let peak = samples.iter().map(|s| s.abs()).max().unwrap() as f32 / 32768.0;
    assert!((peak - 0.5).abs() < 0.01, "peak {peak}");
    std::fs::remove_file(path).ok();
}

#[test]
fn read_wav_mono_gives_back_floats_and_the_file_rate() {
    let path = temp("sine_roundtrip");
    write_sine_wav(&path, 1_000.0, 0.25, 48_000, 0.8).unwrap();
    let (samples, rate) = read_wav_mono(&path).unwrap();
    assert_eq!(rate, 48_000);
    assert_eq!(samples.len(), 12_000);
    let peak = samples.iter().fold(0.0_f32, |m, s| m.max(s.abs()));
    assert!((peak - 0.8).abs() < 0.01, "peak {peak}");
    assert!(samples.iter().all(|s| s.abs() <= 1.0));
    std::fs::remove_file(path).ok();
}

#[test]
fn stereo_files_are_mixed_down_by_averaging_the_channels() {
    let path = temp("stereo");
    let spec = hound::WavSpec { channels: 2, sample_rate: 22_050, bits_per_sample: 16, sample_format: hound::SampleFormat::Int };
    let mut writer = hound::WavWriter::create(&path, spec).unwrap();
    for (l, r) in [(16384, 16384), (16384, -16384), (-8192, 0)] {
        writer.write_sample(l as i16).unwrap();
        writer.write_sample(r as i16).unwrap();
    }
    writer.finalize().unwrap();
    let (samples, rate) = read_wav_mono(&path).unwrap();
    assert_eq!(rate, 22_050);
    assert!(close(&samples, &[0.5, 0.0, -0.125]), "{samples:?}");
    std::fs::remove_file(path).ok();
}

#[test]
fn float_wav_files_are_read_as_they_are() {
    let path = temp("float");
    let spec = hound::WavSpec { channels: 1, sample_rate: 44_100, bits_per_sample: 32, sample_format: hound::SampleFormat::Float };
    let mut writer = hound::WavWriter::create(&path, spec).unwrap();
    for s in [0.25_f32, -0.5, 1.0] {
        writer.write_sample(s).unwrap();
    }
    writer.finalize().unwrap();
    let (samples, _) = read_wav_mono(&path).unwrap();
    assert!(close(&samples, &[0.25, -0.5, 1.0]), "{samples:?}");
    std::fs::remove_file(path).ok();
}

#[test]
fn a_missing_file_is_an_error_not_a_crash() {
    assert!(read_wav_mono(&temp("does_not_exist")).is_err());
}

#[test]
fn the_player_plays_samples_in_order_then_goes_silent() {
    let mut player = SamplePlayer::new(vec![0.1, 0.2, 0.3, 0.4], 44_100, 44_100);
    assert!(!player.is_finished());
    let mut out = vec![9.0_f32; 6];
    player.render(&mut out, 1);
    assert!(close(&out, &[0.1, 0.2, 0.3, 0.4, 0.0, 0.0]), "{out:?}");
    assert!(player.is_finished());
}

#[test]
fn the_player_resamples_when_the_device_rate_is_different() {
    // The file is at half the device's rate, so every file sample must stretch across two device frames.
    let mut player = SamplePlayer::new(vec![0.0, 1.0, 0.0, -1.0], 22_050, 44_100);
    let mut out = vec![9.0_f32; 8];
    player.render(&mut out, 1);
    assert!(close(&out, &[0.0, 0.5, 1.0, 0.5, 0.0, -0.5, -1.0, -0.5]), "{out:?}");
    assert!(player.is_finished());
}

#[test]
fn the_player_copies_each_sample_to_every_channel() {
    let mut player = SamplePlayer::new(vec![0.5, -0.5], 48_000, 48_000);
    let mut out = vec![9.0_f32; 6];
    player.render(&mut out, 2);
    assert!(close(&out, &[0.5, 0.5, -0.5, -0.5, 0.0, 0.0]), "{out:?}");
}
