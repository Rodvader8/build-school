// Lesson 11: read bookings.csv, summarise it, write summary.json.
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
    pub by_room: BTreeMap<String, u32>,
}

/// 9680 becomes "$9,680".
pub fn format_money(amount: u32) -> String {
    let digits = amount.to_string();
    let mut out = String::new();
    for (i, ch) in digits.chars().enumerate() {
        if i > 0 && (digits.len() - i) % 3 == 0 {
            out.push(',');
        }
        out.push(ch);
    }
    format!("${out}")
}

fn number(text: &str, line_number: usize) -> Result<u32, String> {
    text.trim().parse::<u32>().map_err(|_| format!("line {line_number}: '{}' isn't a number", text.trim()))
}

/// Reads the CSV text into bookings.
pub fn parse_bookings(csv: &str) -> Result<Vec<Booking>, String> {
    let mut bookings = Vec::new();
    for (index, line) in csv.lines().enumerate().skip(1) {
        if line.trim().is_empty() {
            continue;
        }
        let line_number = index + 1;
        let cells: Vec<&str> = line.split(',').collect();
        if cells.len() != 5 {
            return Err(format!("line {line_number}: expected 5 columns but found {}", cells.len()));
        }
        bookings.push(Booking {
            date: cells[0].trim().to_string(),
            guest: cells[1].trim().to_string(),
            room: cells[2].trim().to_string(),
            nights: number(cells[3], line_number)?,
            rate: number(cells[4], line_number)?,
        });
    }
    Ok(bookings)
}

/// Counts and totals.
pub fn summarise(bookings: &[Booking]) -> Summary {
    let mut by_room = BTreeMap::new();
    let mut nights = 0;
    for booking in bookings {
        nights += booking.nights;
        *by_room.entry(booking.room.clone()).or_insert(0) += booking.nights * booking.rate;
    }
    Summary {
        bookings: bookings.len(),
        nights,
        revenue: by_room.values().sum(),
        by_room,
    }
}

/// Pretty-printed JSON.
pub fn summary_to_json(summary: &Summary) -> String {
    serde_json::to_string_pretty(&serde_json::json!({
        "bookings": summary.bookings,
        "nights": summary.nights,
        "revenue": summary.revenue,
        "by_room": summary.by_room,
    }))
    .unwrap()
}

/// Reads the CSV, writes the JSON, returns the line to print.
pub fn run(csv_path: &Path, json_path: &Path) -> Result<String, String> {
    let text = std::fs::read_to_string(csv_path).map_err(|e| format!("can't read {}: {e}", csv_path.display()))?;
    let summary = summarise(&parse_bookings(&text)?);
    std::fs::write(json_path, summary_to_json(&summary)).map_err(|e| format!("can't write {}: {e}", json_path.display()))?;
    Ok(format!("{} bookings, {} revenue", summary.bookings, format_money(summary.revenue)))
}
