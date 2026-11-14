// These tests use your crate from the outside, the way another program would. Don't edit them.
use rust_08_modules::money::format_money;
use rust_08_modules::report::summary_json;
use rust_08_modules::rooms::{nightly_rate, ROOM_NAMES};

#[test]
fn format_money_adds_the_dollar_sign_and_commas() {
    assert_eq!(format_money(13200), "$13,200");
    assert_eq!(format_money(950), "$950");
    assert_eq!(format_money(1234567), "$1,234,567");
    assert_eq!(format_money(0), "$0");
}

#[test]
fn rooms_module_knows_every_rate() {
    assert_eq!(ROOM_NAMES.len(), 3);
    assert_eq!(nightly_rate("Ocean Room"), Some(520));
    assert_eq!(nightly_rate("Cliff Suite"), Some(760));
    assert_eq!(nightly_rate("Shed"), None);
}

#[test]
fn summary_json_comes_from_the_serde_json_crate() {
    assert_eq!(summary_json(2, 3000), r#"{"bookings":2,"revenue":3000}"#);
}

#[test]
fn the_serde_json_crate_is_listed_in_cargo_toml() {
    let cargo_toml = std::fs::read_to_string(concat!(env!("CARGO_MANIFEST_DIR"), "/Cargo.toml")).unwrap();
    assert!(cargo_toml.contains("serde_json"));
}
