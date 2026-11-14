use cpal::traits::{DeviceTrait, HostTrait};
use cpal_02_devices::*;

fn name_of(device: &cpal::Device) -> String {
    device.description().map(|d| d.name().to_string()).unwrap_or_else(|_| "(unnamed)".to_string())
}

// This only asks questions. It doesn't open a stream, so it's silent.
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    println!("Audio host: {}", host.id().name());

    let mut names = Vec::new();
    for device in host.output_devices().map_err(|e| format!("can't list devices: {e}"))? {
        names.push(name_of(&device));
    }
    println!("Output devices: {names:?}");
    println!("The one matching \"default\": {:?}", find_device(&names, "default"));

    let device = host.default_output_device().ok_or("no default audio output device")?;
    let config = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    println!("{}", describe_config(&name_of(&device), config.sample_rate(), config.channels()));
    println!("Sample format: {:?}", config.sample_format());

    let ranges: Vec<(u32, u32)> = device
        .supported_output_configs()
        .map_err(|e| format!("can't read supported configs: {e}"))?
        .map(|r| (r.min_sample_rate(), r.max_sample_rate()))
        .collect();
    println!("Supported rate ranges: {ranges:?}");
    println!("If we wanted 44100 Hz we'd use: {:?}", pick_sample_rate(&ranges, 44_100));
    println!("A callback buffer of 1024 floats is {} frames", frames_in_callback(1024, config.channels()));
    Ok(())
}
