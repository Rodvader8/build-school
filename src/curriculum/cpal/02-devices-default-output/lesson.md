Bramble DAW can't assume it knows what's plugged in. Your laptop might have speakers, a USB interface, Bluetooth headphones and a monitor with its own audio, and the user can swap them mid-session. So the first thing any audio program does is ask: what's out there, and what does it want?

**Turn your volume down before pressing Run.** This lesson's program only asks questions and doesn't open a stream, but later ones will make noise, and the habit should be automatic.

## Hosts, devices and configs

CPAL organises the question in three layers:

- A **host** is the operating system's audio system: ALSA or PipeWire on Linux, CoreAudio on a Mac, WASAPI on Windows. `cpal::default_host()` gets the one for this machine.
- A **device** is one thing that makes or takes sound. `host.default_output_device()` returns the one the user has chosen in their system settings. `host.output_devices()` lists them all.
- A **config** is how a device wants to be spoken to: its sample rate, its number of channels and its sample format.

```rust
let host = cpal::default_host();
let device = host.default_output_device().ok_or("no output device")?;
let config = device.default_output_config()?;
println!("{} Hz, {} channels", config.sample_rate(), config.channels());
```

Notice that `default_output_device()` returns an `Option`. A machine with no speakers is a normal situation, not a crash, so you handle `None` and tell the user.

## Ask, don't assume

The playground tone used `supported.sample_rate()` for its pitch maths. If it had hard-coded 44,100 and the device was running at 48,000, every note would sound about 1.5 semitones sharp. The device tells you its rate, and your code adapts.

A device usually supports a **range** of rates, which is why `supported_output_configs()` returns min and max values. If you want a specific rate (say, the 44,100 Hz your WAV files were recorded at), check the ranges and pick the nearest if it's not available.

## Keep logic out of the device calls

Notice how this lesson is split. The calls that touch hardware live in `main.rs`, which only has to compile for the checks. The decisions, like which rate to choose, how to describe a config and how to find a device by name, are plain functions in `lib.rs`. You can test them in milliseconds, on any machine, with no speaker attached. Every CPAL lesson from here is built this way.

## Your turn

Fill in `src/lib.rs`:

1. `channel_layout`: "mono", "stereo", or "N channels".
2. `describe_config`: one line that describes a device's setup.
3. `pick_sample_rate`: the wanted rate if it's supported, otherwise the nearest supported one.
4. `frames_in_callback`: how many frames a buffer of floats holds.
5. `find_device`: find a device's index by part of its name.

Check my work runs the tests. Run prints what your real hardware says, and if it's your first CPAL build it can take a minute to compile.

> If Run says "no default audio output device", that's your function working on real data, not a bug in the lesson.
