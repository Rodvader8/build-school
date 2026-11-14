use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_07_wav::*;
use std::path::Path;

// Press Run with your volume low. It writes tone.wav next to this project, reads it back,
// and plays it once through your speakers.
fn main() -> Result<(), String> {
    let path = Path::new("tone.wav");
    write_sine_wav(path, 523.25, 1.0, 44_100, 0.2).map_err(|e| format!("couldn't write {path:?}: {e}"))?;
    let (samples, file_rate) = read_wav_mono(path).map_err(|e| format!("couldn't read {path:?}: {e}"))?;
    println!("Read {} samples at {file_rate} Hz", samples.len());

    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let device_rate = supported.sample_rate();
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let mut player = SamplePlayer::new(samples, file_rate, device_rate);
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| player.render(data, channels),
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;
    std::thread::sleep(std::time::Duration::from_millis(1300));
    println!("Done");
    Ok(())
}
