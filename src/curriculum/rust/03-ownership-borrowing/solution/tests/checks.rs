// These tests call your functions in src/lib.rs. Read them, but don't edit them.
use rust_03_ownership::*;

#[test]
fn greeting_borrows_the_name() {
    let name = String::from("Okafor");
    assert_eq!(greeting(&name), "Hello, Okafor!");
    // The name is still ours afterwards, because greeting only borrowed it.
    assert_eq!(name, "Okafor");
    assert_eq!(greeting("Nguyen"), "Hello, Nguyen!");
}

#[test]
fn total_chars_counts_every_note() {
    let notes = vec![String::from("late arrival"), String::from("vegan")];
    assert_eq!(total_chars(&notes), 17);
    assert_eq!(total_chars(&notes), 17); // still usable: it was only borrowed
    assert_eq!(total_chars(&[]), 0);
}

#[test]
fn add_note_changes_the_list_it_borrows() {
    let mut notes = Vec::new();
    add_note(&mut notes, "late arrival");
    add_note(&mut notes, "vegan");
    assert_eq!(notes, vec!["late arrival", "vegan"]);
}

#[test]
fn into_upper_takes_ownership_and_hands_back_a_new_string() {
    let original = String::from("bramble");
    let loud = into_upper(original);
    assert_eq!(loud, "BRAMBLE");
}

#[test]
fn first_word_returns_a_slice_of_the_text() {
    assert_eq!(first_word("Ocean Room"), "Ocean");
    assert_eq!(first_word("Cliff"), "Cliff");
    assert_eq!(first_word(""), "");
}
