// These tests check your tool as a user would: its functions, and the finished program run on bookings.csv.
// Read them, but don't edit them.
use rust_11_bookings::*;
use std::path::PathBuf;
use std::process::Command;

const CSV: &str = "date,guest,room,nights,rate\n2026-11-14,M. Okafor,Ocean Room,3,520\n2026-11-15,R. Patel,Ocean Room,1,520\n2026-11-15,A. Nguyen,Cliff Suite,5,760\n";

/// A fresh empty folder for one test to run the program in.
fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("rust_11_bookings_{}_{}", std::process::id(), name));
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

fn run_tool(dir: &PathBuf) -> std::process::Output {
    Command::new(env!("CARGO_BIN_EXE_rust_11_bookings")).current_dir(dir).output().unwrap()
}

#[test]
fn format_money_adds_dollar_sign_and_commas() {
    assert_eq!(format_money(9680), "$9,680");
    assert_eq!(format_money(950), "$950");
    assert_eq!(format_money(1234567), "$1,234,567");
}

#[test]
fn parse_bookings_reads_each_row_after_the_header() {
    let rows = parse_bookings(CSV).unwrap();
    assert_eq!(rows.len(), 3);
    assert_eq!(rows[0].guest, "M. Okafor");
    assert_eq!(rows[0].room, "Ocean Room");
    assert_eq!(rows[0].nights, 3);
    assert_eq!(rows[2].rate, 760);
}

#[test]
fn parse_bookings_names_the_bad_line() {
    let bad = "date,guest,room,nights,rate\n2026-11-14,M. Okafor,Ocean Room,three,520\n";
    let message = parse_bookings(bad).unwrap_err();
    assert!(message.contains("line 2"), "message was: {message}");
    let short = "date,guest,room,nights,rate\n2026-11-14,M. Okafor\n";
    assert!(parse_bookings(short).unwrap_err().contains("line 2"));
}

#[test]
fn summarise_totals_nights_revenue_and_rooms() {
    let summary = summarise(&parse_bookings(CSV).unwrap());
    assert_eq!(summary.bookings, 3);
    assert_eq!(summary.nights, 9);
    assert_eq!(summary.revenue, 1560 + 520 + 3800);
    assert_eq!(summary.by_room["Ocean Room"], 2080);
    assert_eq!(summary.by_room["Cliff Suite"], 3800);
}

#[test]
fn summary_to_json_has_the_same_fields_as_the_python_version() {
    let json = summary_to_json(&summarise(&parse_bookings(CSV).unwrap()));
    let value: serde_json::Value = serde_json::from_str(&json).unwrap();
    assert_eq!(value["bookings"], 3);
    assert_eq!(value["nights"], 9);
    assert_eq!(value["revenue"], 5880);
    assert_eq!(value["by_room"]["Ocean Room"], 2080);
    assert!(json.contains('\n'), "use to_string_pretty so it's indented like the Python output");
}

#[test]
fn the_program_prints_a_summary_and_writes_summary_json() {
    let dir = scratch("happy");
    std::fs::copy(concat!(env!("CARGO_MANIFEST_DIR"), "/bookings.csv"), dir.join("bookings.csv")).unwrap();
    let output = run_tool(&dir);
    assert!(output.status.success(), "stderr: {}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(String::from_utf8_lossy(&output.stdout).trim(), "6 bookings, $9,680 revenue");
    let written = std::fs::read_to_string(dir.join("summary.json")).unwrap();
    let value: serde_json::Value = serde_json::from_str(&written).unwrap();
    assert_eq!(value["revenue"], 9680);
    assert_eq!(value["by_room"]["Cliff Suite"], 5320);
}

#[test]
fn a_missing_file_is_a_clear_error_not_a_crash() {
    let dir = scratch("missing");
    let output = run_tool(&dir);
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(!output.status.success());
    assert!(stderr.contains("bookings.csv"), "stderr was: {stderr}");
    assert!(!stderr.contains("panicked"), "the program should report the error, not panic: {stderr}");
}
