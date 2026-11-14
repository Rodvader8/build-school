// Lesson 5: match, Option and Result.

/// Some(rate) for a known room, None for anything else.
pub fn rate_for(room: &str) -> Option<u32> {
    match room {
        "Ocean Room" => Some(520),
        "Garden Room" => Some(380),
        "Cliff Suite" => Some(760),
        _ => None,
    }
}

/// A sentence for a known room, or a polite "no".
pub fn describe_rate(room: &str) -> String {
    match rate_for(room) {
        Some(rate) => format!("{room} costs ${rate} a night"),
        None => format!("No room called {room}"),
    }
}

/// Turns text like "3" into 3, or says what went wrong.
pub fn parse_nights(text: &str) -> Result<u32, String> {
    match text.trim().parse::<u32>() {
        Ok(0) => Err(String::from("nights must be at least 1")),
        Ok(nights) => Ok(nights),
        Err(_) => Err(format!("'{}' isn't a number", text.trim())),
    }
}

/// Looks up the room, parses the nights, gives nights * rate.
pub fn quote(room: &str, nights: &str) -> Result<u32, String> {
    let rate = rate_for(room).ok_or(format!("No room called {room}"))?;
    let nights = parse_nights(nights)?;
    Ok(nights * rate)
}

/// Words for a stay length.
pub fn stay_type(nights: u32) -> &'static str {
    match nights {
        1 => "one night",
        2..=4 => "short stay",
        _ => "long stay",
    }
}
