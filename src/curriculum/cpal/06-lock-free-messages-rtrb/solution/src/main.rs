use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_06_messages::*;
use std::time::Duration;

// Press Run with your volume low. The main thread plays a little tune by sending messages;
// the audio thread never waits for it. You'll hear five notes over about two seconds.
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f32;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let (mut handle, mut state) = channel(256, sample_rate);
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| state.render(data, channels),
            |err| eprintln!("audio stream error: {err}"),
            None,
        )
        .map_err(|e| format!("failed to build output stream: {e}"))?;
    stream.play().map_err(|e| format!("failed to start stream: {e}"))?;

    handle.send(Command::SetGain(0.15));
    for freq in [262.0, 330.0, 392.0, 523.0] {
        handle.send(Command::NoteOn { freq });
        std::thread::sleep(Duration::from_millis(400));
        handle.send(Command::NoteOff);
        std::thread::sleep(Duration::from_millis(100));
    }
    println!("Done");
    Ok(())
}
