Last lesson set the rules: no locks, no allocation. But a synth still needs the UI to tell the audio thread things: play this note, stop, turn it down. Atomics cover single values. For anything richer, Bramble uses a **ring buffer** of commands from the `rtrb` crate. This is the real mechanism inside its engine.

**Turn your volume down before pressing Run.** It plays four short notes, controlled entirely by messages.

## A queue with one writer and one reader

A ring buffer is a fixed-size queue. Two things make `rtrb` special:

- It's **single-producer, single-consumer**: exactly one thread writes and exactly one reads. That restriction is what lets it work without any locks.
- It's **wait-free**: both `push` and `pop` always return straight away. If the queue is full, `push` returns an error. If it's empty, `pop` returns an error. Neither ever sleeps.

```rust
let (mut producer, mut consumer) = rtrb::RingBuffer::new(256);

producer.push(Command::NoteOff).ok();   // UI thread. Err if full.
while let Ok(command) = consumer.pop() {   // audio thread. Err when empty.
    // handle command
}
```

## Commands as data

A Rust `enum` is perfect for the messages, because each variant can carry its own data:

```rust
#[derive(Clone, Copy)]
pub enum Command {
    NoteOn { freq: f32 },
    NoteOff,
    SetGain(f32),
}
```

Deriving `Copy` makes the messages tiny and allocation-free. Notice there are no `String`s or `Vec`s inside. Sending those would hand the audio thread something to free later, and freeing is exactly the kind of work it must avoid.

## Who owns what

The audio thread **owns** its state (`phase`, `freq`, `gain`, `playing`). Nobody else touches those variables. The UI doesn't change `gain`, it *asks* for a change, and the audio thread applies it at a safe moment: the start of its next buffer. That's the pattern: **don't share, send**. It's the same idea as the channels in the Rust track, just with the lock removed.

## Dropping on purpose

What if the queue's full? `send` here returns `false` and drops the message, rather than waiting. For a gain knob, a lost message is harmless since the next one arrives in a few milliseconds. For something that matters (a note-off) you'd make the queue big enough that it never fills, and Bramble's holds 256.

## Your turn

Fill in `src/lib.rs`:

1. `channel`: build the ring buffer and both ends.
2. `Handle::send`: push, reporting whether it worked.
3. `AudioState::drain_commands`: apply every waiting command.
4. `AudioState::render`: drain first, then fill the buffer.

Check my work runs all of it, including a second thread flooding the queue, without opening your audio device.

> Why drain at the start of `render` and not per sample? A buffer lasts a few milliseconds, so the latency is invisible, and the loop stays tight.
