// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use rust_09_threads::*;

#[test]
fn sum_in_threads_adds_both_halves() {
    let numbers: Vec<u32> = (1..=100).collect();
    assert_eq!(sum_in_threads(numbers), 5050);
    assert_eq!(sum_in_threads(vec![]), 0);
    assert_eq!(sum_in_threads(vec![7]), 7);
}

#[test]
fn workers_report_back_over_a_channel() {
    let messages = collect_messages(4);
    assert_eq!(messages, vec!["worker 0 done", "worker 1 done", "worker 2 done", "worker 3 done"]);
}

#[test]
fn an_atomic_counter_survives_many_threads() {
    assert_eq!(count_with_threads(8, 10_000), 80_000);
}

#[test]
fn a_stop_flag_ends_the_loop() {
    assert!(run_until_stopped());
}

#[test]
fn a_ring_buffer_carries_samples_between_threads() {
    let samples: Vec<f32> = (0..1000).map(|i| i as f32 * 0.001).collect();
    assert_eq!(ring_transfer(samples.clone()), samples);
}
