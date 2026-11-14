// Lesson 5: match, Option and Result. Replace each todo!() with real code.

/// Some(rate) for "Ocean Room" (520), "Garden Room" (380) and "Cliff Suite" (760). None for anything else.
pub fn rate_for(room: &str) -> Option<u32> {
    todo!()
}

/// "Ocean Room costs $520 a night", or "No room called Shed" when rate_for gives None.
/// Use `match rate_for(room) { Some(rate) => ..., None => ... }`.
pub fn describe_rate(room: &str) -> String {
    todo!()
}

/// Turns text like "3" into 3. Errors: "'three' isn't a number", or "nights must be at least 1" for 0.
/// Hint: text.trim().parse::<u32>() gives a Result, and `match` can open it.
pub fn parse_nights(text: &str) -> Result<u32, String> {
    todo!()
}

/// Looks up the room and parses the nights, then gives nights * rate.
/// Use `?` after each step so the first problem comes straight back as the Err.
/// Hint: Option has .ok_or(...) to turn None into an Err.
pub fn quote(room: &str, nights: &str) -> Result<u32, String> {
    todo!()
}

/// "one night" for 1, "short stay" for 2 to 4, "long stay" for 5 or more. Use match with ranges.
pub fn stay_type(nights: u32) -> &'static str {
    todo!()
}
