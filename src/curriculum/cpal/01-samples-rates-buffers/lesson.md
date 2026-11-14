Bramble DAW makes sound by filling lists of numbers, thousands of times a second. Before any oscillator or drum, you need to know what those numbers are and how they're counted. This lesson is the vocabulary, and it's all plain arithmetic.

**Turn your volume down before pressing Run in the CPAL lessons that play sound.** This first one is silent, but the habit is worth having.

## What a sample is

Sound is air pressure going up and down. A computer can't store a smooth wave, so it measures the wave at tiny regular steps and keeps the measurements. Each measurement is a **sample**, a float, normally between -1.0 and 1.0. Silence is 0.0. A speaker cone at full push is 1.0.

## Sample rate

The **sample rate** is how many measurements per second: 44,100 Hz (CD) or 48,000 Hz (most modern devices). Higher rates capture higher pitches. Your device picks one, and your code has to ask what it is instead of assuming. That's the next lesson. For now: at 48,000 Hz, one sample lasts 1/48,000 of a second.

```rust
let seconds = frames as f32 / sample_rate as f32;
```

## Channels and frames

A stereo device wants two numbers per instant: left and right. Together they're a **frame**. Audio APIs hand you one flat buffer where the channels are **interleaved**:

```text
[L0, R0, L1, R1, L2, R2, ...]
```

So a buffer of 1024 floats on a stereo device holds 512 frames. In Rust, `buffer.chunks_mut(channels)` walks it one frame at a time, which is the loop shape you'll see in every audio callback.

```rust
for frame in buffer.chunks_mut(channels) {
    for sample in frame.iter_mut() {
        *sample = 0.0;
    }
}
```

## Buffers and latency

The audio device doesn't ask for one sample at a time. It asks for a **buffer**, a chunk, say 512 frames, every time it's about to run dry. Your code has to fill it before the previous one finishes playing.

That's the deadline. At 48,000 Hz, 512 frames last about 10.7 ms. Miss it and you hear a click or a dropout. A smaller buffer means less delay between pressing a key and hearing it (lower **latency**) but a tighter deadline. A bigger one is safer and laggier. Bramble's callback is working inside that budget every time it runs.

## Your turn

Open `tests/checks.rs` to see what's expected, then fill in `src/lib.rs`:

1. `seconds_for`: frames to seconds.
2. `frames_for`: seconds to whole frames.
3. `latency_ms`: a buffer's length in milliseconds.
4. `interleave_mono`: repeat each sample once per channel.
5. `fill_ramp`: fill an interleaved buffer with a rising ramp, the same value across each frame.

Then press Run to print the numbers, and Check my work to run the tests. Nothing here opens an audio device.

> A mono tone played on a stereo device needs `interleave_mono`'s trick: the same sample copied into both channels.
