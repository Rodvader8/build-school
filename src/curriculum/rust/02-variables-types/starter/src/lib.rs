// Lesson 2: variables and types. Replace each todo!() with real code.

/// Nights times the nightly rate, in whole dollars.
pub fn nightly_total(nights: u32, rate: u32) -> u32 {
    todo!()
}

/// Adds 10% GST and rounds to the nearest dollar. 4400 becomes 4840.
/// Hint: turn the number into an f64 with `as f64`, multiply by 1.1, call .round(), then `as u32`.
pub fn with_gst(amount: u32) -> u32 {
    todo!()
}

/// "one night" for 1, "long stay" for 5 or more, otherwise "short stay".
pub fn nights_label(nights: u32) -> &'static str {
    todo!()
}

/// nightly_total, with GST added when `gst` is true. Use `let mut` for the running total.
pub fn stay_cost(nights: u32, rate: u32, gst: bool) -> u32 {
    todo!()
}

/// Total divided by nights, keeping the decimals. Needs both numbers as f64.
pub fn average_rate(total: u32, nights: u32) -> f64 {
    todo!()
}
