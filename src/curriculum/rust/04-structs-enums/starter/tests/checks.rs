// These tests call your code in src/lib.rs. Read them, but don't edit them.
use rust_04_structs::*;

#[test]
fn each_room_has_its_own_rate() {
    assert_eq!(Room::Ocean.rate(), 520);
    assert_eq!(Room::Garden.rate(), 380);
    assert_eq!(Room::Cliff.rate(), 760);
}

#[test]
fn each_room_has_a_display_name() {
    assert_eq!(Room::Ocean.name(), "Ocean Room");
    assert_eq!(Room::Garden.name(), "Garden Room");
    assert_eq!(Room::Cliff.name(), "Cliff Suite");
}

#[test]
fn a_new_booking_takes_its_rate_from_the_room() {
    let booking = Booking::new("M. Okafor", Room::Ocean, 3);
    assert_eq!(booking.guest, "M. Okafor");
    assert_eq!(booking.nights, 3);
    assert_eq!(booking.rate, 520);
}

#[test]
fn total_is_nights_times_rate() {
    assert_eq!(Booking::new("A. Nguyen", Room::Cliff, 5).total(), 3800);
    assert_eq!(Booking::new("R. Patel", Room::Ocean, 1).total(), 520);
}

#[test]
fn summary_reads_like_a_sentence() {
    let booking = Booking::new("J. Lindqvist", Room::Garden, 2);
    assert_eq!(booking.summary(), "J. Lindqvist: Garden Room, 2 nights, $760");
}
