// Lesson 2: devices and the default output. The questions a program asks before it makes a sound.

/// A friendly name for a channel count: "mono", "stereo", or "6 channels".
pub fn channel_layout(channels: u16) -> String {
    match channels {
        1 => "mono".to_string(),
        2 => "stereo".to_string(),
        n => format!("{n} channels"),
    }
}

/// "Speakers: 48000 Hz, stereo"
pub fn describe_config(name: &str, sample_rate: u32, channels: u16) -> String {
    format!("{name}: {sample_rate} Hz, {}", channel_layout(channels))
}

/// Given the (min, max) sample-rate ranges a device supports, choose a rate: the wanted one if any range holds it,
/// otherwise the supported rate closest to it. None when there are no ranges.
pub fn pick_sample_rate(ranges: &[(u32, u32)], wanted: u32) -> Option<u32> {
    if ranges.iter().any(|&(min, max)| (min..=max).contains(&wanted)) {
        return Some(wanted);
    }
    ranges
        .iter()
        .flat_map(|&(min, max)| [min, max])
        .min_by_key(|&edge| edge.abs_diff(wanted))
}

/// How many frames an output callback's buffer holds.
pub fn frames_in_callback(data_len: usize, channels: u16) -> usize {
    data_len / channels as usize
}

/// The index of the first device whose name contains `wanted`, ignoring upper and lower case.
pub fn find_device(names: &[String], wanted: &str) -> Option<usize> {
    let wanted = wanted.to_lowercase();
    names.iter().position(|name| name.to_lowercase().contains(&wanted))
}
