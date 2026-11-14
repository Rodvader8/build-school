// Lesson 9: threads, channels and atomics.
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{mpsc, Arc};
use std::thread;

/// Adds the two halves on two threads.
pub fn sum_in_threads(mut numbers: Vec<u32>) -> u32 {
    let mid = numbers.len() / 2;
    let second = numbers.split_off(mid);
    let first = numbers;
    let a = thread::spawn(move || first.iter().sum::<u32>());
    let b = thread::spawn(move || second.iter().sum::<u32>());
    a.join().unwrap() + b.join().unwrap()
}

/// Workers report back over a channel.
pub fn collect_messages(count: usize) -> Vec<String> {
    let (tx, rx) = mpsc::channel();
    for i in 0..count {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(format!("worker {i} done")).unwrap();
        });
    }
    drop(tx); // the original sender, so the loop below can end
    let mut messages: Vec<String> = rx.into_iter().collect();
    messages.sort();
    messages
}

/// Many threads share one atomic counter.
pub fn count_with_threads(threads: usize, per_thread: usize) -> usize {
    let counter = Arc::new(AtomicUsize::new(0));
    let mut handles = Vec::new();
    for _ in 0..threads {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            for _ in 0..per_thread {
                counter.fetch_add(1, Ordering::Relaxed);
            }
        }));
    }
    for handle in handles {
        handle.join().unwrap();
    }
    counter.load(Ordering::Relaxed)
}

/// A worker loops until the stop flag flips.
pub fn run_until_stopped() -> bool {
    let stop = Arc::new(AtomicBool::new(false));
    let flag = Arc::clone(&stop);
    let worker = thread::spawn(move || {
        while !flag.load(Ordering::Relaxed) {
            thread::yield_now();
        }
        true
    });
    stop.store(true, Ordering::Relaxed);
    worker.join().unwrap()
}

/// Samples go through a small lock-free ring buffer.
pub fn ring_transfer(samples: Vec<f32>) -> Vec<f32> {
    let total = samples.len();
    let (mut producer, mut consumer) = rtrb::RingBuffer::new(8);
    let writer = thread::spawn(move || {
        for sample in samples {
            while producer.push(sample).is_err() {
                thread::yield_now();
            }
        }
    });
    let mut out = Vec::with_capacity(total);
    while out.len() < total {
        match consumer.pop() {
            Ok(sample) => out.push(sample),
            Err(_) => thread::yield_now(),
        }
    }
    writer.join().unwrap();
    out
}
