// Lesson 2: devices and the default output. The questions a program asks before it makes a sound.
// Replace each todo!() with real code. `cargo run` asks your real device the same questions (silently).

/// A friendly name for a channel count: "mono", "stereo", or "6 channels".
/// Hint: `match channels { 1 => ..., 2 => ..., n => format!("{n} channels") }`
pub fn channel_layout(channels: u16) -> String {
    todo!()
}

/// "Speakers: 48000 Hz, stereo". Use `format!` and your channel_layout.
pub fn describe_config(name: &str, sample_rate: u32, channels: u16) -> String {
    todo!()
}

/// Given the (min, max) sample-rate ranges a device supports, choose a rate: the wanted one if any range holds it,
/// otherwise the supported rate closest to it. None when there are no ranges.
/// Hint: `(min..=max).contains(&wanted)`, then collect every min and max edge and use
/// `.min_by_key(|&edge| edge.abs_diff(wanted))`.
pub fn pick_sample_rate(ranges: &[(u32, u32)], wanted: u32) -> Option<u32> {
    todo!()
}

/// How many frames an output callback's buffer holds (the buffer has `channels` floats per frame).
pub fn frames_in_callback(data_len: usize, channels: u16) -> usize {
    todo!()
}

/// The index of the first device whose name contains `wanted`, ignoring upper and lower case.
/// Hint: `.to_lowercase()` on both, then `names.iter().position(...)`.
pub fn find_device(names: &[String], wanted: &str) -> Option<usize> {
    todo!()
}
