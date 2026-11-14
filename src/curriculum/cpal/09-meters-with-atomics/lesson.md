The level meters in Bramble's mixer move 60 times a second, driven by what the audio thread is playing right now. That's a nice little problem: one thread produces numbers at audio speed, another wants to read them at screen speed, and neither is allowed to wait for the other. Atomics are the answer, and this lesson builds the meter.

**Turn your volume down before pressing Run.** It plays a swelling tone for five seconds and prints a meter in the terminal.

## The shape of the problem

The audio callback sees every sample. The UI only wants to know, every 16 milliseconds or so, "how loud has it been lately?" A **peak meter** answers that: the largest absolute sample value since the UI last looked.

The audio thread must not lock, so the shared number is an atomic, the same trick as the gain in lesson 5: store an `f32` as its bits in an `AtomicU32`.

```rust
pub struct Meter { peak: AtomicU32 }
```

## fetch_max: a neat trick

You want "keep the larger of the old peak and this buffer's peak". Written as read, compare, write, two threads could interleave and one update gets lost. Atomics offer `fetch_max`, which does all three as a single indivisible operation:

```rust
self.peak.fetch_max(loudest.to_bits(), Ordering::Relaxed);
```

There's a catch. `fetch_max` compares *integers*, and we're storing float bits. Luckily, for **non-negative** floats, the bit patterns sort in the same order as the numbers do, so comparing them as integers gives the right answer. That's why `update` takes the absolute value first.

## Taking a reading

If the meter just kept the loudest ever, it'd peg at the first loud note and stay there. So the UI **takes** the peak: reads it and resets it to zero in one atomic step.

```rust
f32::from_bits(self.peak.swap(0.0_f32.to_bits(), Ordering::Relaxed))
```

`swap` stores the new value and gives back the old one. Nothing the audio thread writes between those two moments can be lost. The next reading then covers only what happened since.

## Decibels, and how a meter should fall

Our ears judge loudness roughly logarithmically, so meters show **decibels**: `20 * log10(level)`, where 1.0 is 0 dB, half is about -6 dB, and silence is minus infinity. That's why `peak_to_db` clamps to -60. It keeps the number on screen.

Real meters also have *ballistics*: they jump up instantly, so you never miss a peak, but fall back slowly, so the eye can follow. The `fall` function does that, in dB per second. It's the same easing idea as the camera smoothing in the Three.js track, just applied to a bar.

## Your turn

Fill in `src/lib.rs`:

1. `Meter::update`: take the largest absolute sample and `fetch_max` it in.
2. `Meter::peek` and `Meter::take`: read, or read-and-reset.
3. `peak_to_db`: linear to decibels, floored at -60.
4. `fall`: instant rise, limited fall.

The tests hammer one meter from several threads at once and check that the loudest value always wins.

> You can share `Arc<Meter>` freely because every method takes `&self`. The compiler checks this for you.
