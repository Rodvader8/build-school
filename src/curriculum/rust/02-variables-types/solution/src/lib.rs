// Lesson 2: variables and types.

/// Nights times the nightly rate, in whole dollars.
pub fn nightly_total(nights: u32, rate: u32) -> u32 {
    nights * rate
}

/// Adds 10% GST and rounds to the nearest dollar. 4400 becomes 4840.
pub fn with_gst(amount: u32) -> u32 {
    (amount as f64 * 1.1).round() as u32
}

/// "one night" for 1, "long stay" for 5 or more, otherwise "short stay".
pub fn nights_label(nights: u32) -> &'static str {
    if nights == 1 {
        "one night"
    } else if nights >= 5 {
        "long stay"
    } else {
        "short stay"
    }
}

/// nightly_total, with GST added when `gst` is true.
pub fn stay_cost(nights: u32, rate: u32, gst: bool) -> u32 {
    let mut total = nightly_total(nights, rate);
    if gst {
        total = with_gst(total);
    }
    total
}

/// Total divided by nights, keeping the decimals.
pub fn average_rate(total: u32, nights: u32) -> f64 {
    total as f64 / nights as f64
}
