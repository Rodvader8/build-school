use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_03_sine::*;

// Press Run with your volume low. This plays a quiet 440 Hz tone for two seconds.
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();
    println!("Playing 440 Hz at {sample_rate} Hz, {channels} channels");

    let mut sine = Sine::new(440.0, sample_rate);
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| sine.fill(data, channels, 0.15),
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;
    std::thread::sleep(std::time::Duration::from_secs(2));
    println!("Done");
    Ok(())
}
