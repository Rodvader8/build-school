use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_10_drums::*;
use std::path::Path;

// Press Run with your volume low. It renders two bars to beat.wav, then plays the beat live for about eight seconds.
fn main() -> Result<(), String> {
    let pattern = Pattern::from_strings([
        "x...x...x...x...", // kick
        "....x.......x...", // snare
        "x.x.x.x.x.x.x.xx", // hi-hat
    ]);

    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let bpm = 110.0;
    let rendered = render_offline(&pattern, bpm, sample_rate, 2);
    write_wav(Path::new("beat.wav"), &rendered, sample_rate as u32).map_err(|e| format!("couldn't write beat.wav: {e}"))?;
    println!("Wrote beat.wav ({} frames)", rendered.len());

    let mut machine = DrumMachine::new(pattern, bpm, sample_rate);
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| machine.render(data, channels),
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;
    std::thread::sleep(std::time::Duration::from_secs(8));
    println!("Done");
    Ok(())
}
