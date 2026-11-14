This is the lesson Bramble is built around. An audio callback runs on a special thread with a hard deadline, about ten milliseconds, over and over. If it's late once, you hear a click. So it follows rules that normal programs never worry about.

**Turn your volume down before pressing Run.** The program fades a tone up and down for four seconds.

## What the audio thread must never do

1. **Wait on a lock.** A `Mutex` makes you wait if another thread holds it. If the UI thread has it during your deadline, you're late.
2. **Allocate memory.** `Vec::new()`, `vec![]`, `String`, `format!`, `Box::new`, `.collect()`: they all ask the system allocator for memory, which can take a lock of its own, or go to the operating system for more pages, at an unpredictable cost.
3. **Block on anything else.** File reads, network, `println!` (it locks stdout), `thread::sleep`.

None of those are *wrong*, just unpredictable. The cost on average is tiny, but real-time audio cares about the worst case, not the average.

## So how do you share data?

**Atomics.** An atomic number can be read and written from two threads at once with no lock, and neither side ever waits. They only come in whole-number types, so to share a float you store its bits:

```rust
use std::sync::atomic::{AtomicU32, Ordering};

shared.store(0.25_f32.to_bits(), Ordering::Relaxed);        // UI thread
let gain = f32::from_bits(shared.load(Ordering::Relaxed));  // audio thread
```

This is how Bramble shares its meters and its playing flag. `Relaxed` is the plain setting, right for a lone value.

## Allocate early, reuse forever

Anything the callback needs, such as a delay buffer, a scratch area or a list of voices, gets allocated *before* the stream starts, in `new()`. In the callback you only read and write what's already there. A delay line is the classic case:

```rust
let read = (self.write + len - frames) % len;   // where the old sample lives
```

A fixed-size buffer plus a position that wraps round with `%` is a **ring buffer**. Nothing grows, so nothing allocates.

## How the tests catch you

`tests/checks.rs` swaps in a counting memory allocator for the test program, a thread-local tally of every allocation. It runs your `render` and `process` over thousands of samples and asserts the count is zero. If you leave a `vec![]` in the wrong place, the failure message tells you how many allocations happened.

It's a nice trick for your own projects, too: assert on an invariant instead of hoping.

## Your turn

Fill in `src/lib.rs`:

1. `set_gain` and `get_gain`: an f32 through an `AtomicU32`.
2. Fix `Tone::render`. It works, but it builds a `Vec` on every call. Write straight into `out`.
3. `Delay::new`: allocate the buffer once.
4. `Delay::process`: read, write and advance the ring position.

> `Relaxed` ordering says "I don't care what order other things happen in relative to this value". That's fine for a gain, and not for something that guards other data.
