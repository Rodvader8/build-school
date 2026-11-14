A raw sine wave never stops, which is a lousy sound for a note. Real sounds have a shape in time: a piano string is hit, rings and dies away. That change of volume over time is the **envelope**, and it's what makes a bleep sound like an instrument.

This lesson rebuilds a voice from Bramble DAW's engine: the metronome click.

**Turn your volume down before pressing Run.** Clicks are short and sharp, and a downbeat can surprise you.

## The ADSR family

Synths describe envelopes with four stages: **A**ttack (how fast it rises), **D**ecay (how fast it falls to a held level), **S**ustain (the held level while you keep the key down) and **R**elease (how long it fades after you let go). A click skips the middle: it just starts at full strength and dies away. A one-stage envelope is the simplest one that still sounds musical.

## Exponential decay

The most natural-sounding fade is **exponential**: lose a fixed *percentage* of what's left each step, not a fixed amount. In code that's one multiply per sample:

```rust
self.amp *= self.decay;   // decay is a bit under 1.0, like 0.9992
```

You choose the speed with a **time constant**: the time it takes to fall to about 37% (that's 1/e) of its start. Bramble's click uses 25 ms. The coefficient comes from a small piece of maths:

```rust
let decay = (-1.0 / (time_constant * sample_rate)).exp();
```

Work it out at 48,000 Hz and a 25 ms time constant and you get about 0.99917. Tiny, but applied 48,000 times a second it adds up quickly.

## Switching off

An exponential decay never truly reaches zero. It just gets smaller and smaller. Left alone, the voice would keep doing a little maths on denormal-tiny numbers forever. So pick a floor: once the envelope drops under 0.0001 (about -80 dB, long inaudible), treat the voice as off and return `0.0` immediately. `is_active()` reports that.

## Triggering without a click

Ironically, the way you'd get an unwanted click is by starting a sound mid-wave. If a new note began where the sine happened to be at 0.8, the speaker would jump from silence to 0.8 in one sample, and you'd hear a pop. Starting at phase 0 means starting at `sin(0) = 0`, so the sound grows from nothing. The tests check this: after `trigger`, the first sample must be exactly zero.

The other half is retriggering. A second click arriving mid-fade should restart the volume at full strength, so `trigger` sets `amp` every time.

## Your turn

Fill in `src/lib.rs`, mirroring Bramble's `ClickVoice`:

1. `decay_coefficient`: the per-sample multiplier.
2. `trigger`: set phase to 0, and frequency and amplitude by downbeat or not (1760 Hz at 0.5, or 880 Hz at 0.35).
3. `is_active`: is the envelope still at 0.0001 or above?
4. `next`: one sample, then advance the phase and the envelope.
5. `fill`: copy that sample to every channel.

Check my work tests all of it silently. Run plays four beats of metronome, twice.

> Bramble's engine does exactly this per-frame, inside the audio callback, with no allocations. That rule is next.
