Bramble DAW plays drum samples, exports stems and mixes recordings, and every one of those is a WAV file. The `hound` crate reads and writes them. This lesson turns a file into the same kind of float buffer you've been filling by hand, and plays it back at the right speed.

**Turn your volume down before pressing Run.** It writes a `tone.wav` next to the project and plays it for a second.

## What's in a WAV

A WAV file is a small header (how many channels, what sample rate, how many bits per sample) followed by the raw samples. For the common 16-bit kind they're whole numbers from -32768 to 32767, interleaved just like the buffers in lesson 1. `hound` parses the header and hands you the samples.

```rust
let mut reader = hound::WavReader::open("kick.wav")?;
let spec = reader.spec();                       // channels, sample_rate, bits_per_sample, sample_format
for sample in reader.samples::<i16>() {
    let value = sample? as f32 / 32768.0;       // to -1.0 .. 1.0
}
```

Writing is the mirror image:

```rust
let spec = hound::WavSpec { channels: 1, sample_rate: 44_100, bits_per_sample: 16, sample_format: hound::SampleFormat::Int };
let mut writer = hound::WavWriter::create("out.wav", spec)?;
writer.write_sample(1234_i16)?;
writer.finalize()?;                             // fixes up the header; don't forget it
```

Floating-point WAV files exist too (`SampleFormat::Float`), and their samples are already -1.0 to 1.0. A reader that only handles 16-bit will choke on them, so match on the format.

## Load before the callback, never inside it

Reading a file is exactly what lesson 5 said the audio thread must not do. So load the whole file into a `Vec<f32>` **before** the stream starts, and hand it to the callback. The callback only reads from memory.

## Mixing down

Stereo samples come in pairs. The simplest way to get mono is to average each frame: `(left + right) / 2`. The tests check it with a file where the two sides cancel out to exactly 0.

## Different sample rates

A sample recorded at 44,100 Hz played on a 48,000 Hz device without any adjustment comes out about 1.5 semitones sharp and shorter. The player keeps a fractional **position** into the samples and moves it by `file_rate / device_rate` per output frame. At 22,050 into 44,100 it moves half a sample at a time.

When the position lands between two samples, **linear interpolation** blends them:

```rust
let value = a + (b - a) * fraction;   // fraction is 0.0 to 1.0 between a and b
```

It isn't audiophile-grade resampling, but it's what a lot of simple samplers do, and it sounds fine for drums.

## Your turn

Fill in `src/lib.rs`:

1. `write_sine_wav`: a 16-bit mono tone, written with `WavWriter`.
2. `read_wav_mono`: handle both integer and float files, and average multi-channel frames to mono.
3. `SamplePlayer::new`, `is_finished` and `render`: advance a fractional position, interpolate, and go silent at the end.

The checks write real files into your temp folder, and play nothing.

> A missing file should give you an `Err`, so `main` can print a friendly message. That's why every function here returns a `Result`.
