use rust_03_ownership::*;

fn main() {
    let guest = String::from("Okafor");
    println!("{}", greeting(&guest)); // borrow: guest is still ours
    println!("guest is still here: {guest}");

    let mut notes = Vec::new();
    add_note(&mut notes, "late arrival");
    add_note(&mut notes, "vegan");
    println!("{} notes, {} characters", notes.len(), total_chars(&notes));

    let loud = into_upper(guest); // move: guest is gone after this line
    println!("{loud}");
    // println!("{guest}");  // try un-commenting this one and read the error

    println!("first word: {}", first_word("Ocean Room"));
}
