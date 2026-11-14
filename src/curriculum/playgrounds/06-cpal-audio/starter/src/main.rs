use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::f32::consts::TAU;

fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device
        .default_output_config()
        .map_err(|e| format!("no default output config: {e}"))?;

    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();
    println!("Playing 440 Hz at {sample_rate} Hz, {channels} channels");

    let frequency = 440.0;
    let volume = 0.15; // keep it gentle
    let mut phase = 0.0_f32;

    // This closure is the audio callback. It runs on a real-time thread, many times a second,
    // and must fill `data` with samples fast: no printing, no locking, no allocating in here.
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
                for frame in data.chunks_mut(channels) {
                    let sample = (phase * TAU).sin() * volume;
                    phase = (phase + frequency / sample_rate) % 1.0;
                    for out in frame.iter_mut() {
                        *out = sample;
                    }
                }
            },
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;

    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;
    std::thread::sleep(std::time::Duration::from_secs(2));
    println!("Done");
    Ok(())
}
