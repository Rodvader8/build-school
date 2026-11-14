// Lesson 9: threads, channels and atomics. Replace each todo!() with real code.
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{mpsc, Arc};
use std::thread;

/// Split the numbers into two halves, add each half on its own thread, then add the two answers.
/// Hint: let second = numbers.split_off(mid); then thread::spawn(move || first.iter().sum::<u32>()).
/// `.join().unwrap()` waits for a thread and gives back what it returned.
pub fn sum_in_threads(mut numbers: Vec<u32>) -> u32 {
    todo!()
}

/// Starts `count` threads. Worker i sends the String "worker {i} done" down a channel.
/// Collect what arrives, sort it, and return it.
/// Hint: let (tx, rx) = mpsc::channel(); give each thread tx.clone(); drop(tx) when you're done spawning,
/// then `for message in rx { ... }` ends once every sender is gone.
pub fn collect_messages(count: usize) -> Vec<String> {
    todo!()
}

/// Starts `threads` threads that each add 1 to a shared counter `per_thread` times. Returns the final count.
/// Hint: Arc<AtomicUsize> shared between threads; counter.fetch_add(1, Ordering::Relaxed).
pub fn count_with_threads(threads: usize, per_thread: usize) -> usize {
    todo!()
}

/// A worker thread spins in a loop until an AtomicBool says stop. Returns true when the worker has finished.
/// Hint: Arc<AtomicBool>; the worker does `while !stop.load(Ordering::Relaxed) { thread::yield_now(); }`.
/// The main thread then calls stop.store(true, Ordering::Relaxed) and joins the worker.
pub fn run_until_stopped() -> bool {
    todo!()
}

/// Bramble's trick: a lock-free ring buffer. A producer thread pushes every sample in, and this thread pops them out.
/// Make the buffer small (8 slots) so it fills up and the producer has to wait: if push gives Err, call thread::yield_now() and try again.
/// Returns the samples in the order they came out.
/// Hint: let (mut producer, mut consumer) = rtrb::RingBuffer::new(8); producer.push(x) and consumer.pop() both return a Result.
pub fn ring_transfer(samples: Vec<f32>) -> Vec<f32> {
    todo!()
}
