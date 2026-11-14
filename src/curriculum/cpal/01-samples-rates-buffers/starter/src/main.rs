use cpal_01_samples::*;

fn main() {
    // No sound in this lesson: it's all numbers. Run it to see what a buffer means in real time.
    for (frames, rate) in [(256, 44_100), (512, 48_000), (1024, 48_000)] {
        println!("{frames} frames at {rate} Hz = {:.2} ms", latency_ms(frames, rate));
    }
    println!("half a second at 44100 Hz = {} frames", frames_for(0.5, 44_100));
    let mut stereo = vec![0.0_f32; 8];
    fill_ramp(&mut stereo, 2);
    println!("a 4-frame stereo ramp: {stereo:?}");
    println!("a mono tone spread over 2 channels: {:?}", interleave_mono(&[0.1, 0.2, 0.3], 2));
}
