// Lesson 7: playing WAV files with hound. Replace each todo!() with real code.
// Writing and reading use files, so the tests do that in your temp folder. No audio device is touched.
use hound::{SampleFormat, WavReader, WavSpec, WavWriter};
use std::f32::consts::TAU;
use std::path::Path;

/// Write a mono, 16-bit sine tone to `path`: `seconds` long, at `sample_rate`, peaking at `amplitude` (0.0 to 1.0).
/// Hint: WavSpec { channels: 1, sample_rate, bits_per_sample: 16, sample_format: SampleFormat::Int },
/// WavWriter::create(path, spec)?, then writer.write_sample(x as i16)? for each frame, then writer.finalize().
/// A 16-bit file stores whole numbers from -32768 to 32767, so scale a float by `i16::MAX as f32`.
pub fn write_sine_wav(path: &Path, freq: f32, seconds: f32, sample_rate: u32, amplitude: f32) -> Result<(), hound::Error> {
    todo!()
}

/// Read a WAV file as mono floats from -1.0 to 1.0, plus the file's sample rate.
/// Stereo (or more channels) is mixed down by averaging each frame.
/// Hint: WavReader::open(path)?, reader.spec() says the format. For SampleFormat::Float, `reader.samples::<f32>()`.
/// For SampleFormat::Int, read `samples::<i32>()` and divide by 2^(bits - 1) ((1_i64 << (bits - 1)) as f32).
/// Collect into a Vec<f32> with `.collect::<Result<_, _>>()?`, then `.chunks(channels)` to average each frame.
pub fn read_wav_mono(path: &Path) -> Result<(Vec<f32>, u32), hound::Error> {
    todo!()
}

/// Plays a loaded sample once, at the right speed for the device.
pub struct SamplePlayer {
    samples: Vec<f32>,
    position: f64, // a fractional index into `samples`
    step: f64,     // how far to move per output frame: file_rate / device_rate
}

impl SamplePlayer {
    pub fn new(samples: Vec<f32>, file_rate: u32, device_rate: u32) -> Self {
        todo!()
    }

    /// True once the position has run off the end of the samples.
    pub fn is_finished(&self) -> bool {
        todo!()
    }

    /// Fill an interleaved buffer, one value per frame copied to every channel.
    /// Between two file samples, blend them (linear interpolation): with i = position as usize and
    /// fraction = position - i, the value is a + (b - a) * fraction, where a = samples[i] and b = samples[i + 1]
    /// (use 0.0 if there is no next sample). Then position += step.
    /// After the last sample, write silence.
    pub fn render(&mut self, out: &mut [f32], channels: usize) {
        todo!()
    }
}
