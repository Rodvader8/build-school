// Lesson 6: vectors and hashmaps. Replace each todo!() with real code.
use std::collections::HashMap;

/// Adds up every number in the slice. Try a `for` loop first, then `.iter().sum()`.
pub fn total_nights(nights: &[u32]) -> u32 {
    todo!()
}

/// Only the stays of 5 nights or more, in order, as a new Vec.
/// Hint: nights.iter().filter(|n| **n >= 5).copied().collect()
pub fn long_stays(nights: &[u32]) -> Vec<u32> {
    todo!()
}

/// Every amount plus 10% GST, rounded (4400 becomes 4840), as a new Vec.
/// Hint: .iter().map(|a| ...).collect()
pub fn with_gst_all(amounts: &[u32]) -> Vec<u32> {
    todo!()
}

/// Adds each sale's amount into a running total per room name.
/// Hint: *totals.entry(room.to_string()).or_insert(0) += amount;
pub fn revenue_by_room(sales: &[(&str, u32)]) -> HashMap<String, u32> {
    todo!()
}

/// The room with the highest total, or None if the map is empty.
/// Hint: totals.iter().max_by_key(|(_, total)| **total) gives Option<(&String, &u32)>.
pub fn top_room(totals: &HashMap<String, u32>) -> Option<String> {
    todo!()
}

/// All the room names, A to Z. A HashMap has no order, so collect the keys and .sort() them.
pub fn rooms_sorted(totals: &HashMap<String, u32>) -> Vec<String> {
    todo!()
}
