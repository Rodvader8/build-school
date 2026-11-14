A sine wave is the purest sound there is, one frequency and nothing else. It's also the first thing every synth needs, and the playground's tone is exactly this idea. Here you'll write it as a proper type, with the shape Bramble's voices use.

**Turn your volume down before pressing Run.** It plays a quiet 440 Hz tone for two seconds, but speakers vary, and it's easier to turn up than to recover from a surprise.

## Phase: where you are in the cycle

A sine wave goes round and round. We track where it is in the current round as the **phase**, a number from 0.0 (start of a cycle) up to just under 1.0 (end of it). To get a sample, turn the phase into an angle and take the sine:

```rust
let sample = (self.phase * TAU).sin();   // TAU = 2 * pi, a full turn
```

Then move on a little. How far? A 440 Hz tone does 440 cycles every second, and there are 48,000 samples every second, so each sample covers 440 / 48,000 of a cycle:

```rust
self.phase += self.freq / self.sample_rate;
if self.phase >= 1.0 {
    self.phase -= 1.0;   // wrap round, keeping the leftover
}
```

That's the whole oscillator. Frequency decides how big each step is: bigger steps go round faster, and the pitch goes up.

## Why track phase and not time

You could compute `sin(time * freq * TAU)` instead. It works until you change the pitch. Jump from 440 to 880 Hz in the middle of a note and `time * freq` suddenly leaps, the wave teleports to a different point, and you hear a click. With a running phase, changing the frequency only changes the step size from now on, so the wave stays continuous. That's what `set_frequency` leaves alone: the phase.

Floats lose precision as they grow, too. Keeping phase between 0 and 1 means it never gets big enough to matter, even after hours.

## Filling the buffer

CPAL calls your callback with an empty buffer to fill. The pattern is the one from lesson 1: walk frame by frame, work out **one** sample, and copy it to each channel.

```rust
for frame in data.chunks_mut(channels) {
    let sample = self.next_sample() * volume;
    for out in frame.iter_mut() { *out = sample; }
}
```

If you called `next_sample()` once per channel instead, stereo would play at double speed, an octave up. Worth remembering when something sounds wrong.

The state (`phase`) lives inside the struct, so the next callback carries on from where the last one stopped. The tests check there's no jump at the seam.

## Your turn

Open `tests/checks.rs`, then fill in `src/lib.rs`:

1. `set_frequency`: just store it.
2. `next_sample`: read the sample, advance the phase, wrap it, return the sample.
3. `fill`: one sample per frame, copied to all channels, scaled by volume.

Check my work runs the tests with no sound. Run plays the tone.

> Keep `volume` small. A full-scale sine at 1.0 is much louder than it feels, and 0.15 is plenty.
