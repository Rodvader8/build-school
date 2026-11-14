use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal_04_envelopes::*;

// Press Run with your volume low. It plays a metronome: one high click, then three lower ones, twice.
fn main() -> Result<(), String> {
    let host = cpal::default_host();
    let device = host.default_output_device().ok_or("no default audio output device")?;
    let supported = device.default_output_config().map_err(|e| format!("no default output config: {e}"))?;
    let sample_rate = supported.sample_rate() as f64;
    let channels = supported.channels() as usize;
    let config: cpal::StreamConfig = supported.into();

    let beat = (sample_rate * 0.5) as usize; // 120 beats a minute
    let mut voice = ClickVoice::new(sample_rate);
    let mut frames_played = 0usize;
    let stream = device
        .build_output_stream(
            config,
            move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
                for frame in data.chunks_mut(channels) {
                    if frames_played % beat == 0 {
                        voice.trigger((frames_played / beat) % 4 == 0);
                    }
                    frames_played += 1;
                    let sample = voice.next() * 0.5;
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
    std::thread::sleep(std::time::Duration::from_secs(4));
    println!("Done");
    Ok(())
}
