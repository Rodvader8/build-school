use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_05_realtime::*;
use std::sync::Arc;
use std::sync::atomic::AtomicU32;
use std::time::Duration;

// Press Run with your volume low. A tone fades up and down for four seconds. The main thread changes the gain
// while the audio thread reads it, with no lock between them: that's the whole lesson in one program.
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let gain = Arc::new(AtomicU32::new(0));
    let audio_gain = Arc::clone(&gain);
    let mut tone = Tone::new(330.0, sample_rate);
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| tone.render(data, channels, &audio_gain),
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;

    for step in 0..40 {
        let wave = (step as f32 / 40.0 * std::f32::consts::TAU).sin().abs();
        set_gain(&gain, wave * 0.15);
        std::thread::sleep(Duration::from_millis(100));
    }
    println!("Done");
    Ok(())
}
