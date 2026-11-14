// Lesson 4: structs and enums.

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Room {
    Ocean,
    Garden,
    Cliff,
}

impl Room {
    /// The nightly rate.
    pub fn rate(&self) -> u32 {
        match self {
            Room::Ocean => 520,
            Room::Garden => 380,
            Room::Cliff => 760,
        }
    }

    /// The display name.
    pub fn name(&self) -> &'static str {
        match self {
            Room::Ocean => "Ocean Room",
            Room::Garden => "Garden Room",
            Room::Cliff => "Cliff Suite",
        }
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
    /// Builds a booking. The rate comes from the room.
    pub fn new(guest: &str, room: Room, nights: u32) -> Booking {
        Booking {
            guest: guest.to_string(),
            room,
            nights,
            rate: room.rate(),
        }
    }

    /// Nights times rate.
    pub fn total(&self) -> u32 {
        self.nights * self.rate
    }

    /// "J. Lindqvist: Garden Room, 2 nights, $760".
    pub fn summary(&self) -> String {
        format!("{}: {}, {} nights, ${}", self.guest, self.room.name(), self.nights, self.total())
    }
}
