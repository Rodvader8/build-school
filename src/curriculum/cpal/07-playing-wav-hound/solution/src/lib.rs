// Lesson 7: playing WAV files with hound.
use hound::{SampleFormat, WavReader, WavSpec, WavWriter};
use std::f32::consts::TAU;
use std::path::Path;

/// Write a mono, 16-bit sine tone to `path`.
pub fn write_sine_wav(path: &Path, freq: f32, seconds: f32, sample_rate: u32, amplitude: f32) -> Result<(), hound::Error> {
    let spec = WavSpec { channels: 1, sample_rate, bits_per_sample: 16, sample_format: SampleFormat::Int };
    let mut writer = WavWriter::create(path, spec)?;
    let frames = (seconds * sample_rate as f32).round() as usize;
    for i in 0..frames {
        let sample = (i as f32 * freq / sample_rate as f32 * TAU).sin() * amplitude;
        writer.write_sample((sample * i16::MAX as f32) as i16)?;
    }
    writer.finalize()
}

/// Read a WAV file as mono floats from -1.0 to 1.0, plus the file's sample rate.
/// Stereo (or more channels) is mixed down by averaging each frame.
pub fn read_wav_mono(path: &Path) -> Result<(Vec<f32>, u32), hound::Error> {
    let mut reader = WavReader::open(path)?;
    let spec = reader.spec();
    let interleaved: Vec<f32> = match spec.sample_format {
        SampleFormat::Float => reader.samples::<f32>().collect::<Result<_, _>>()?,
        SampleFormat::Int => {
            let scale = (1_i64 << (spec.bits_per_sample - 1)) as f32;
            reader.samples::<i32>().map(|s| s.map(|v| v as f32 / scale)).collect::<Result<_, _>>()?
        }
    };
    let channels = spec.channels as usize;
    let mono = interleaved.chunks(channels).map(|frame| frame.iter().sum::<f32>() / channels as f32).collect();
    Ok((mono, spec.sample_rate))
}

/// Plays a loaded sample once, at the right speed for the device.
pub struct SamplePlayer {
    samples: Vec<f32>,
    position: f64, // a fractional index into `samples`
    step: f64,     // how far to move per output frame: file_rate / device_rate
}

impl SamplePlayer {
    pub fn new(samples: Vec<f32>, file_rate: u32, device_rate: u32) -> Self {
        SamplePlayer { samples, position: 0.0, step: file_rate as f64 / device_rate as f64 }
    }

    pub fn is_finished(&self) -> bool {
        self.position >= self.samples.len() as f64
    }

    /// Fill an interleaved buffer. Between two file samples, blend them (linear interpolation).
    /// After the last sample, write silence.
    pub fn render(&mut self, out: &mut [f32], channels: usize) {
        for frame in out.chunks_mut(channels) {
            let value = if self.is_finished() {
                0.0
            } else {
                let i = self.position as usize;
                let fraction = (self.position - i as f64) as f32;
                let a = self.samples[i];
                let b = self.samples.get(i + 1).copied().unwrap_or(0.0);
                self.position += self.step;
                a + (b - a) * fraction
            };
            for slot in frame.iter_mut() {
                *slot = value;
            }
        }
    }
}
