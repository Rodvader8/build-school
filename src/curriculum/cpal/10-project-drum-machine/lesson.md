Time to put it all together. A step sequencer is the heart of every drum machine and a big part of every DAW, Bramble's included. You write the engine that counts time, decides who plays when, mixes the drums and saves the result to a file, using nearly everything from this track.

**Turn your volume down before pressing Run.** Three drums at once is louder than a lone sine, and the kick has real thump.

## What you're building

A grid of 3 lanes (kick, snare, hi-hat) by 16 steps. A step is a sixteenth note. When the playhead reaches a step, every lane switched on there fires its drum.

```text
kick   x...x...x...x...
snare  ....x.......x...
hat    x.x.x.x.x.x.x.xx
```

The drum voices are written for you: they're the exponential envelope from lesson 4 with a pitch sweep for the kick and cheap noise for the snare and hat. Read them once, because they're a good example of real-time-safe code. No allocation, no locks, even their random numbers come from a tiny formula.

## Counting time in frames

Audio has no clock to ask. The only clock is **how many frames you've produced**. So the sequencer counts down:

```rust
if self.until_next <= 0.0 {
    // fire this step's drums
    self.until_next += samples_per_step(self.bpm, self.sample_rate);
}
self.until_next -= 1.0;
```

Two details are worth the thinking. First, steps are rarely a whole number of frames: at 120 bpm and 44,100 Hz a step is 5,512.5. If you reset the counter to a rounded number you'd drift out of time within a few bars. Adding the length keeps the leftover fraction. Second, the check happens at the start of each frame, so step 0 fires on the very first frame with no gap.

## Mixing and clipping

Mixing is just adding the samples together. But three loud drums can add up past 1.0, and a speaker can't go past full scale, so the signal gets cut flat and sounds harsh. That's **clipping**. The simplest safety net is `clamp(-1.0, 1.0)`. A real mixer would turn the voices down first or use a limiter, but a clamp keeps this honest.

## One engine, two ways out

Notice that live playback and file export use *the same* `render`. The live version calls it with whatever buffer CPAL gives you. The offline version calls it once with a big buffer and saves the result with `hound`. Because there's one engine, what you hear and what you export are the same. That's also why the tests can check an entire bar without a speaker.

The test that renders in tiny, awkward buffer sizes (1, 7, 64, 333 frames) and compares with one big render is the important one. It proves the sequencer carries its state correctly from callback to callback, which is the property a real audio engine lives or dies by.

## Your turn

Open `tests/checks.rs`, then fill in `src/lib.rs`:

1. `Pattern::toggle` and `Pattern::is_on`.
2. `samples_per_step`.
3. `DrumMachine::next_frame`: the countdown, the triggers and the mix.
4. `DrumMachine::render`: clamp and copy to every channel.
5. `render_offline`: a bar-count of frames, mono.
6. `write_wav`: save it with `hound`.

Check my work runs everything silently. Run writes `beat.wav` and plays the groove.

> Once it works, edit the patterns in `main.rs`. That's your drum machine now.
