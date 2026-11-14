// The rooms and their rates. Already finished, so you can see how a module file looks.

pub const ROOM_NAMES: [&str; 3] = ["Ocean Room", "Garden Room", "Cliff Suite"];

pub fn nightly_rate(room: &str) -> Option<u32> {
    match room {
        "Ocean Room" => Some(520),
        "Garden Room" => Some(380),
        "Cliff Suite" => Some(760),
        _ => None,
    }
}
