// Lesson 3: ownership and borrowing. Replace each todo!() with real code.

/// Borrows a name and builds "Hello, <name>!". Use format!.
pub fn greeting(name: &str) -> String {
    todo!()
}

/// Borrows the whole list of notes and adds up the characters in them (use .len() on each).
pub fn total_chars(notes: &[String]) -> usize {
    todo!()
}

/// Borrows the list *mutably* and pushes one more note onto it.
pub fn add_note(notes: &mut Vec<String>, note: &str) {
    todo!()
}

/// Takes ownership of the String, and returns an UPPERCASE version (see .to_uppercase()).
pub fn into_upper(text: String) -> String {
    todo!()
}

/// Returns the text up to the first space, as a slice of the original (no new String).
/// Hint: text.split(' ').next() gives an Option; .unwrap_or("") is a safe way to open it for now.
pub fn first_word(text: &str) -> &str {
    todo!()
}
