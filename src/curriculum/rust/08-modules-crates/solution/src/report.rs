// Turns numbers into JSON text.

/// {"bookings":2,"revenue":3000}
pub fn summary_json(bookings: u32, revenue: u32) -> String {
    serde_json::json!({ "bookings": bookings, "revenue": revenue }).to_string()
}
