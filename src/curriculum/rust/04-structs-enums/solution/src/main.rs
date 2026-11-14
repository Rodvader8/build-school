use rust_04_structs::*;

fn main() {
    let bookings = [
        Booking::new("M. Okafor", Room::Ocean, 3),
        Booking::new("J. Lindqvist", Room::Garden, 2),
        Booking::new("A. Nguyen", Room::Cliff, 5),
    ];
    for booking in &bookings {
        println!("{}", booking.summary());
    }
}
