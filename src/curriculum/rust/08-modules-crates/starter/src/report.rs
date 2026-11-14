// Turns numbers into JSON text.

/// {"bookings":2,"revenue":3000}
/// Add `serde_json = "1"` under [dependencies] in Cargo.toml, then build the text with
/// serde_json::json!({ "bookings": bookings, "revenue": revenue }).to_string()
pub fn summary_json(bookings: u32, revenue: u32) -> String {
    todo!()
}
