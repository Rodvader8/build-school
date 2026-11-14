// These tests call your code in src/lib.rs. Read them, but don't edit them.
//
// They also count memory allocations. This test program swaps in an allocator that tallies every
// allocation made on the current thread, so "render must not allocate" is checked for real.
use cpal_05_realtime::*;
use std::alloc::{GlobalAlloc, Layout, System};
use std::cell::Cell;
use std::sync::atomic::AtomicU32;

thread_local! {
    static ALLOCATIONS: Cell<usize> = const { Cell::new(0) };
}

struct Counting;

unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        ALLOCATIONS.with(|c| c.set(c.get() + 1));
        unsafe { System.alloc(layout) }
    }
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        unsafe { System.dealloc(ptr, layout) }
    }
}

#[global_allocator]
static ALLOCATOR: Counting = Counting;

fn allocations_during(work: impl FnOnce()) -> usize {
    let before = ALLOCATIONS.with(|c| c.get());
    work();
    ALLOCATIONS.with(|c| c.get()) - before
}

fn close(a: &[f32], b: &[f32]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| (x - y).abs() < 1e-3)
}

#[test]
fn the_gain_survives_a_round_trip_through_an_atomic() {
    let shared = AtomicU32::new(0);
    for gain in [0.0_f32, 0.25, 1.0, 0.123_456] {
        set_gain(&shared, gain);
        assert_eq!(get_gain(&shared), gain);
    }
}

#[test]
fn render_scales_the_tone_by_the_shared_gain() {
    let shared = AtomicU32::new(0);
    set_gain(&shared, 0.5);
    let mut tone = Tone::new(12_000.0, 48_000.0);
    let mut out = vec![0.0_f32; 4];
    tone.render(&mut out, 1, &shared);
    assert!(close(&out, &[0.0, 0.5, 0.0, -0.5]), "{out:?}");

    set_gain(&shared, 0.0);
    tone.render(&mut out, 1, &shared);
    assert!(out.iter().all(|&s| s == 0.0), "{out:?}");

    set_gain(&shared, 1.0);
    let mut stereo = vec![0.0_f32; 4];
    Tone::new(12_000.0, 48_000.0).render(&mut stereo, 2, &shared);
    assert!(close(&stereo, &[0.0, 0.0, 1.0, 1.0]), "{stereo:?}");
}

#[test]
fn render_does_not_allocate() {
    let shared = AtomicU32::new(0);
    set_gain(&shared, 0.3);
    let mut tone = Tone::new(440.0, 48_000.0);
    let mut out = vec![0.0_f32; 1024];
    let count = allocations_during(|| {
        for _ in 0..20 {
            tone.render(&mut out, 2, &shared);
        }
    });
    assert_eq!(count, 0, "render allocated {count} times: the audio thread must never ask the allocator for memory");
}

#[test]
fn the_delay_repeats_the_input_after_n_frames() {
    let mut delay = Delay::new(8);
    let input = [1.0_f32, 2.0, 3.0, 4.0, 0.0, 0.0, 0.0, 0.0];
    let out: Vec<f32> = input.iter().map(|&x| delay.process(x, 3)).collect();
    assert!(close(&out, &[0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 0.0]), "{out:?}");
}

#[test]
fn the_delay_keeps_working_after_its_buffer_has_wrapped() {
    let mut delay = Delay::new(8);
    let input: Vec<f32> = (1..=40).map(|i| i as f32).collect();
    let out: Vec<f32> = input.iter().map(|&x| delay.process(x, 5)).collect();
    for i in 0..40 {
        let want = if i >= 5 { input[i - 5] } else { 0.0 };
        assert!((out[i] - want).abs() < 1e-6, "sample {i}: got {}, wanted {want}", out[i]);
    }
}

#[test]
fn the_delay_allocates_up_front_and_never_again() {
    let mut delay = Delay::new(1024);
    let count = allocations_during(|| {
        for i in 0..50_000 {
            delay.process((i % 100) as f32, 700);
        }
    });
    assert_eq!(count, 0, "process allocated {count} times");
}
