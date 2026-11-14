// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use rust_05_match::*;

#[test]
fn rate_for_finds_known_rooms_only() {
    assert_eq!(rate_for("Ocean Room"), Some(520));
    assert_eq!(rate_for("Garden Room"), Some(380));
    assert_eq!(rate_for("Cliff Suite"), Some(760));
    assert_eq!(rate_for("Broom Cupboard"), None);
}

#[test]
fn describe_rate_handles_both_cases() {
    assert_eq!(describe_rate("Ocean Room"), "Ocean Room costs $520 a night");
    assert_eq!(describe_rate("Shed"), "No room called Shed");
}

#[test]
fn parse_nights_accepts_whole_numbers() {
    assert_eq!(parse_nights("3"), Ok(3));
    assert_eq!(parse_nights("  12 "), Ok(12));
}

#[test]
fn parse_nights_explains_what_went_wrong() {
    assert_eq!(parse_nights("three"), Err(String::from("'three' isn't a number")));
    assert_eq!(parse_nights("0"), Err(String::from("nights must be at least 1")));
}

#[test]
fn quote_chains_the_steps_with_a_question_mark() {
    assert_eq!(quote("Cliff Suite", "5"), Ok(3800));
    assert_eq!(quote("Cliff Suite", "x"), Err(String::from("'x' isn't a number")));
    assert_eq!(quote("Shed", "2"), Err(String::from("No room called Shed")));
}

#[test]
fn stay_type_matches_on_ranges() {
    assert_eq!(stay_type(1), "one night");
    assert_eq!(stay_type(3), "short stay");
    assert_eq!(stay_type(7), "long stay");
}
