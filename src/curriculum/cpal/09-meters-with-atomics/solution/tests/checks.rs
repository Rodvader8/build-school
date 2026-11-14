// These tests call your code in src/lib.rs. Read them, but don't edit them.
use cpal_09_meters::*;
use std::sync::Arc;

#[test]
fn the_meter_remembers_the_loudest_sample_it_has_seen() {
    let meter = Meter::new();
    assert_eq!(meter.peek(), 0.0);
    meter.update(&[0.1, -0.7, 0.3]); // negative samples count by their size
    assert!((meter.peek() - 0.7).abs() < 1e-6);
    meter.update(&[0.2, 0.1]); // quieter: nothing changes
    assert!((meter.peek() - 0.7).abs() < 1e-6);
    meter.update(&[0.9]);
    assert!((meter.peek() - 0.9).abs() < 1e-6);
}

#[test]
fn take_returns_the_peak_and_starts_again_from_zero() {
    let meter = Meter::new();
    meter.update(&[0.5, -0.8]);
    assert!((meter.take() - 0.8).abs() < 1e-6);
    assert_eq!(meter.peek(), 0.0);
    meter.update(&[0.2]);
    assert!((meter.take() - 0.2).abs() < 1e-6);
    assert_eq!(meter.take(), 0.0);
}

#[test]
fn an_empty_block_changes_nothing() {
    let meter = Meter::new();
    meter.update(&[]);
    assert_eq!(meter.peek(), 0.0);
}

#[test]
fn many_threads_can_update_one_meter_and_the_loudest_wins() {
    let meter = Arc::new(Meter::new());
    let mut handles = Vec::new();
    for t in 0..4 {
        let meter = Arc::clone(&meter);
        handles.push(std::thread::spawn(move || {
            for i in 0..2_000 {
                let level = ((t * 2_000 + i) % 1_000) as f32 / 1_000.0 * 0.95;
                meter.update(&[level, -level * 0.5]);
            }
        }));
    }
    for handle in handles {
        handle.join().unwrap();
    }
    assert!((meter.peek() - 0.949).abs() < 0.002, "{}", meter.peek());
}

#[test]
fn a_reader_sees_a_rising_value_while_a_writer_works() {
    let meter = Arc::new(Meter::new());
    let writer_meter = Arc::clone(&meter);
    let writer = std::thread::spawn(move || {
        for i in 0..20_000 {
            writer_meter.update(&[i as f32 / 20_000.0]);
        }
    });
    let mut last = 0.0_f32;
    while !writer.is_finished() {
        let now = meter.peek();
        assert!(now >= last && (0.0..=1.0).contains(&now), "went from {last} to {now}");
        last = now;
    }
    writer.join().unwrap();
    assert!((meter.peek() - 0.99995).abs() < 1e-4);
}

#[test]
fn peak_to_db_uses_20_log10_with_a_floor_of_minus_60() {
    assert!(peak_to_db(1.0).abs() < 1e-4);
    assert!((peak_to_db(0.5) + 6.0206).abs() < 1e-3);
    assert!((peak_to_db(0.1) + 20.0).abs() < 1e-3);
    assert_eq!(peak_to_db(0.0), -60.0);
    assert_eq!(peak_to_db(0.0001), -60.0);
}

#[test]
fn the_displayed_level_jumps_up_instantly_and_falls_slowly() {
    // 20 dB per second, over a tenth of a second: it can drop 2 dB per step.
    assert_eq!(fall(-30.0, -6.0, 20.0, 0.1), -6.0);
    assert!((fall(-6.0, -30.0, 20.0, 0.1) + 8.0).abs() < 1e-4);
    assert!((fall(-6.0, -7.0, 20.0, 0.1) + 7.0).abs() < 1e-4, "it should not fall past the real level");
    assert_eq!(fall(-20.0, -20.0, 20.0, 0.1), -20.0);
}
