// Lesson 3: ownership and borrowing.

/// Borrows a name and builds "Hello, <name>!".
pub fn greeting(name: &str) -> String {
    format!("Hello, {name}!")
}

/// Borrows the whole list of notes and adds up the characters in them.
pub fn total_chars(notes: &[String]) -> usize {
    let mut total = 0;
    for note in notes {
        total += note.len();
    }
    total
}

/// Borrows the list mutably and pushes one more note onto it.
pub fn add_note(notes: &mut Vec<String>, note: &str) {
    notes.push(note.to_string());
}

/// Takes ownership of the String, and returns an UPPERCASE version.
pub fn into_upper(text: String) -> String {
    text.to_uppercase()
}

/// Returns the text up to the first space, as a slice of the original.
pub fn first_word(text: &str) -> &str {
    text.split(' ').next().unwrap_or("")
}
