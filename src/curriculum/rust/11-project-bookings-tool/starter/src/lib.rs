// Lesson 11: read bookings.csv, summarise it, write summary.json. Same job as the Python version.
// Replace each todo!() with real code. Everything else is set up for you.
use std::collections::BTreeMap;
use std::path::Path;

#[derive(Debug)]
pub struct Booking {
    pub date: String,
    pub guest: String,
    pub room: String,
    pub nights: u32,
    pub rate: u32,
}

pub struct Summary {
    pub bookings: usize,
    pub nights: u32,
    pub revenue: u32,
    /// Revenue per room. A BTreeMap keeps the rooms in alphabetical order, so output never shuffles.
    pub by_room: BTreeMap<String, u32>,
}

/// 9680 becomes "$9,680". You wrote this in lesson 8, so copy it over.
pub fn format_money(amount: u32) -> String {
    todo!()
}

/// Reads the CSV text: skip the header, skip blank lines, split each row on ','.
/// A row with the wrong number of columns, or nights/rate that aren't numbers, is an Err that
/// names the line, like "line 2: 'three' isn't a number". Line 1 is the header, so the first row is line 2.
/// Hint: for (index, line) in csv.lines().enumerate().skip(1) { let line_number = index + 1; ... }
pub fn parse_bookings(csv: &str) -> Result<Vec<Booking>, String> {
    todo!()
}

/// Counts bookings, adds up nights and revenue (nights * rate), and totals revenue per room.
pub fn summarise(bookings: &[Booking]) -> Summary {
    todo!()
}

/// Pretty-printed JSON with the keys bookings, nights, revenue and by_room.
/// Hint: serde_json::to_string_pretty(&serde_json::json!({ "bookings": ..., "by_room": summary.by_room })).unwrap()
pub fn summary_to_json(summary: &Summary) -> String {
    todo!()
}

/// The whole job: read the CSV file, summarise it, write the JSON file, and return the line to print,
/// like "6 bookings, $9,680 revenue". Any problem comes back as an Err with a message that includes the file name.
/// Hint: std::fs::read_to_string(path).map_err(|e| format!("can't read {}: {e}", path.display()))?
pub fn run(csv_path: &Path, json_path: &Path) -> Result<String, String> {
    todo!()
}
