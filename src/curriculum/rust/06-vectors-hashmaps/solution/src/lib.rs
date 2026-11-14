// Lesson 6: vectors and hashmaps.
use std::collections::HashMap;

/// Adds up every number in the slice.
pub fn total_nights(nights: &[u32]) -> u32 {
    nights.iter().sum()
}

/// Only the stays of 5 nights or more.
pub fn long_stays(nights: &[u32]) -> Vec<u32> {
    nights.iter().filter(|n| **n >= 5).copied().collect()
}

/// Every amount plus 10% GST, rounded.
pub fn with_gst_all(amounts: &[u32]) -> Vec<u32> {
    amounts.iter().map(|a| (*a as f64 * 1.1).round() as u32).collect()
}

/// A running total per room name.
pub fn revenue_by_room(sales: &[(&str, u32)]) -> HashMap<String, u32> {
    let mut totals = HashMap::new();
    for (room, amount) in sales {
        *totals.entry(room.to_string()).or_insert(0) += amount;
    }
    totals
}

/// The room with the highest total.
pub fn top_room(totals: &HashMap<String, u32>) -> Option<String> {
    totals.iter().max_by_key(|(_, total)| **total).map(|(room, _)| room.clone())
}

/// All the room names, A to Z.
pub fn rooms_sorted(totals: &HashMap<String, u32>) -> Vec<String> {
    let mut rooms: Vec<String> = totals.keys().cloned().collect();
    rooms.sort();
    rooms
}
