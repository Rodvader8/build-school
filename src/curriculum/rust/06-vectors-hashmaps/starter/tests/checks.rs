// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use rust_06_collections::*;

#[test]
fn total_nights_adds_up_a_slice() {
    assert_eq!(total_nights(&[3, 2, 5, 1, 4, 2]), 17);
    assert_eq!(total_nights(&[]), 0);
}

#[test]
fn long_stays_keeps_five_nights_or_more() {
    assert_eq!(long_stays(&[3, 2, 5, 1, 4, 7]), vec![5, 7]);
    assert!(long_stays(&[1, 2]).is_empty());
}

#[test]
fn with_gst_all_builds_a_new_vec() {
    assert_eq!(with_gst_all(&[100, 4400]), vec![110, 4840]);
}

#[test]
fn revenue_by_room_groups_with_a_hashmap() {
    let sales = [("Ocean Room", 1560), ("Garden Room", 760), ("Ocean Room", 520)];
    let totals = revenue_by_room(&sales);
    assert_eq!(totals.len(), 2);
    assert_eq!(totals.get("Ocean Room"), Some(&2080));
    assert_eq!(totals.get("Garden Room"), Some(&760));
    assert_eq!(totals.get("Cliff Suite"), None);
}

#[test]
fn top_room_finds_the_biggest_earner() {
    let sales = [("Ocean Room", 1560), ("Cliff Suite", 3800), ("Ocean Room", 520)];
    let totals = revenue_by_room(&sales);
    assert_eq!(top_room(&totals), Some(String::from("Cliff Suite")));
    assert_eq!(top_room(&revenue_by_room(&[])), None);
}

#[test]
fn rooms_sorted_lists_names_alphabetically() {
    let sales = [("Ocean Room", 1), ("Cliff Suite", 1), ("Garden Room", 1)];
    let totals = revenue_by_room(&sales);
    assert_eq!(rooms_sorted(&totals), vec!["Cliff Suite", "Garden Room", "Ocean Room"]);
}
