// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use cpal_02_devices::*;

#[test]
fn channel_layouts_have_friendly_names() {
    assert_eq!(channel_layout(1), "mono");
    assert_eq!(channel_layout(2), "stereo");
    assert_eq!(channel_layout(6), "6 channels");
}

#[test]
fn describe_config_reads_like_a_sentence() {
    assert_eq!(describe_config("Speakers", 48_000, 2), "Speakers: 48000 Hz, stereo");
    assert_eq!(describe_config("USB Mic", 44_100, 1), "USB Mic: 44100 Hz, mono");
    assert_eq!(describe_config("Surround", 96_000, 8), "Surround: 96000 Hz, 8 channels");
}

#[test]
fn pick_sample_rate_uses_the_wanted_rate_when_it_is_supported() {
    assert_eq!(pick_sample_rate(&[(8_000, 48_000)], 44_100), Some(44_100));
    assert_eq!(pick_sample_rate(&[(8_000, 22_050), (44_100, 96_000)], 48_000), Some(48_000));
}

#[test]
fn pick_sample_rate_falls_back_to_the_nearest_edge() {
    assert_eq!(pick_sample_rate(&[(48_000, 48_000)], 44_100), Some(48_000));
    assert_eq!(pick_sample_rate(&[(8_000, 32_000)], 44_100), Some(32_000));
    assert_eq!(pick_sample_rate(&[(8_000, 16_000), (48_000, 96_000)], 40_000), Some(48_000));
    assert_eq!(pick_sample_rate(&[], 44_100), None);
}

#[test]
fn frames_in_callback_divides_by_channels() {
    assert_eq!(frames_in_callback(1024, 2), 512);
    assert_eq!(frames_in_callback(480, 1), 480);
    assert_eq!(frames_in_callback(0, 2), 0);
}

#[test]
fn find_device_matches_part_of_a_name_ignoring_case() {
    let names = vec!["HDA Intel PCH".to_string(), "USB Audio Interface".to_string(), "default".to_string()];
    assert_eq!(find_device(&names, "usb"), Some(1));
    assert_eq!(find_device(&names, "DEFAULT"), Some(2));
    assert_eq!(find_device(&names, "bluetooth"), None);
}
