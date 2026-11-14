// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use rust_02_types::*;

#[test]
fn nightly_total_multiplies_nights_by_rate() {
    assert_eq!(nightly_total(3, 520), 1560);
    assert_eq!(nightly_total(0, 520), 0);
}

#[test]
fn with_gst_adds_ten_percent() {
    assert_eq!(with_gst(4400), 4840);
    assert_eq!(with_gst(1560), 1716);
}

#[test]
fn nights_label_picks_the_right_words() {
    assert_eq!(nights_label(1), "one night");
    assert_eq!(nights_label(2), "short stay");
    assert_eq!(nights_label(4), "short stay");
    assert_eq!(nights_label(5), "long stay");
    assert_eq!(nights_label(9), "long stay");
}

#[test]
fn stay_cost_adds_gst_only_when_asked() {
    assert_eq!(stay_cost(3, 520, false), 1560);
    assert_eq!(stay_cost(3, 520, true), 1716);
}

#[test]
fn average_rate_keeps_the_decimals() {
    assert!((average_rate(1560, 4) - 390.0).abs() < 1e-9);
    assert!((average_rate(1000, 3) - 333.3333333).abs() < 1e-6);
}
