// Lesson 4: structs and enums. The types are written for you. Fill in the todo!()s.

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Room {
    Ocean,
    Garden,
    Cliff,
}

impl Room {
    /// The nightly rate: Ocean 520, Garden 380, Cliff 760. Use `match self`.
    pub fn rate(&self) -> u32 {
        todo!()
    }

    /// "Ocean Room", "Garden Room" or "Cliff Suite".
    pub fn name(&self) -> &'static str {
        todo!()
    }
}

#[derive(Debug)]
pub struct Booking {
    pub guest: String,
    pub room: Room,
    pub nights: u32,
    pub rate: u32,
}

impl Booking {
    /// Builds a booking. The rate comes from the room, so callers don't pass it in.
    pub fn new(guest: &str, room: Room, nights: u32) -> Booking {
        todo!()
    }

    /// Nights times rate.
    pub fn total(&self) -> u32 {
        todo!()
    }

    /// "J. Lindqvist: Garden Room, 2 nights, $760" (use format!).
    pub fn summary(&self) -> String {
        todo!()
    }
}
