This is the lesson Bramble is really about. An audio app has at least two jobs running at once: a **UI thread** drawing the window, and an **audio thread** that must fill a buffer every few milliseconds, no matter what. If the audio thread waits for anything slow, you hear a click. The two have to talk to each other without ever blocking.

Other languages let you share data between threads and hope. Python's GIL stops threads running truly in parallel, and JavaScript avoids the problem with a single thread. Rust lets threads run in parallel and gives you tools that the compiler checks. If your code could have a data race, it won't compile.

## Spawning a thread

```rust
use std::thread;

let handle = thread::spawn(move || {
    // runs on a new thread
    42
});
let answer = handle.join().unwrap();   // wait, and get the 42 back
```

The closure starts with `move`. That's lesson 3 again: the thread **takes ownership** of what it uses, so the original thread can't touch it. Two threads can't both own the same Vec, and that's what makes data races impossible.

## Channels: send, don't share

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();           // transmitter, receiver
let tx2 = tx.clone();
thread::spawn(move || tx2.send("hello").unwrap());
println!("{}", rx.recv().unwrap());
```

You can clone the sending end for many workers, but there's one receiver. Looping `for msg in rx` ends once **every** sender has been dropped, so drop your original `tx` too. Forgetting that is the classic hang.

## Arc and atomics: share a counter

To share one value, wrap it in an `Arc` (atomic reference count, a clonable handle to one shared thing). For a simple number or flag, use an **atomic** type, which can be changed from any thread without a lock:

```rust
use std::sync::{Arc, atomic::{AtomicUsize, AtomicBool, Ordering}};

let counter = Arc::new(AtomicUsize::new(0));
let c = Arc::clone(&counter);
thread::spawn(move || { c.fetch_add(1, Ordering::Relaxed); });
```

Bramble's `playing: AtomicBool` is exactly this: the UI flips it and the audio thread reads it. `Ordering::Relaxed` is the simplest setting, and it's right for a lone flag or counter.

A `Mutex` also exists for bigger shared data, but it makes threads wait for each other. The audio thread can't afford that, so Bramble avoids mutexes there.

## Ring buffers: a lock-free pipe

An `rtrb` ring buffer is a fixed-size queue with one writer and one reader and no locks at all. The UI thread pushes commands in, and the audio thread pops them out:

```rust
let (mut producer, mut consumer) = rtrb::RingBuffer::new(256);
producer.push(command).ok();             // Err if the buffer's full
let next = consumer.pop();               // Err if it's empty
```

Neither side ever waits: a full or empty buffer just returns an `Err` and you carry on. Open `engine.rs` in Bramble and you'll see `rtrb::Producer<Command>` in the engine handle, which is lesson-9 code doing real work.

## Your turn

Open `tests/checks.rs`, then fill in `src/lib.rs`:

1. `sum_in_threads`: two threads, one per half, joined.
2. `collect_messages`: workers send over a channel, and you gather and sort the replies.
3. `count_with_threads`: an `Arc<AtomicUsize>` shared by many threads.
4. `run_until_stopped`: a worker loops until an `AtomicBool` flips.
5. `ring_transfer`: a producer thread pushes samples into an 8-slot `rtrb` buffer while this thread pops them.

> Tip: if a test hangs, a thread is probably waiting on something that never arrives. Check you dropped the original `tx`, and that your loops can end.
