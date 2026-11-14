use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_09_meters::*;
use std::sync::Arc;
use std::time::Duration;

// Press Run with your volume low. A tone swells and fades for five seconds while the main thread
// draws a level meter in the terminal. The audio thread only ever calls meter.update().
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let meter = Arc::new(Meter::new());
    let audio_meter = Arc::clone(&meter);
    let volume = Arc::new(std::sync::atomic::AtomicU32::new(0));
    let audio_volume = Arc::clone(&volume);
    let mut phase = 0.0_f32;
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
                let gain = f32::from_bits(audio_volume.load(std::sync::atomic::Ordering::Relaxed));
                for frame in data.chunks_mut(channels) {
                    let sample = (phase * std::f32::consts::TAU).sin() * gain;
                    phase = (phase + 220.0 / sample_rate) % 1.0;
                    for out in frame.iter_mut() {
                        *out = sample;
                    }
                }
                audio_meter.update(data); // the one line the audio thread needs
            },
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;

    let mut shown = -60.0_f32;
    for step in 0..50 {
        let swell = (step as f32 / 50.0 * std::f32::consts::PI).sin();
        volume.store((swell * 0.25).to_bits(), std::sync::atomic::Ordering::Relaxed);
        std::thread::sleep(Duration::from_millis(100));
        shown = fall(shown, peak_to_db(meter.take()), 20.0, 0.1);
        let bar = "#".repeat(((shown + 60.0) / 2.0).max(0.0) as usize);
        println!("{shown:6.1} dB {bar}");
    }
    println!("Done");
    Ok(())
}
