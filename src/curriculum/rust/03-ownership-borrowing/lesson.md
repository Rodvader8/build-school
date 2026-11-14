This is the idea Rust is famous for, and the one that makes it feel odd at first. It's also why Bramble can run audio and a UI on separate threads without a crash. Get this lesson and the rest of Rust gets a lot easier.

## The problem it solves

Python and JavaScript clean up memory with a garbage collector that runs when it likes. That's fine for a website. It's not fine for an audio callback that has about five milliseconds to fill a buffer, because a pause means a click in the speakers. Rust has no garbage collector. Instead the compiler tracks who owns each value, and frees it at exactly the right moment.

## Three rules

1. Every value has one **owner**.
2. When the owner goes out of scope, the value is dropped (freed).
3. Assigning or passing a value **moves** it to a new owner. The old one can't use it any more.

```rust
let guest = String::from("Okafor");
let other = guest;          // moved
println!("{guest}");        // compile error: guest was moved
```

Plain numbers and bools are the exception. They're cheap, so they're copied instead of moved, and you never notice.

## Borrowing

Moving everything around would be tedious, so you can lend a value with `&`:

```rust
fn greeting(name: &str) -> String {
    format!("Hello, {name}!")
}

let guest = String::from("Okafor");
greeting(&guest);           // lent out
println!("{guest}");        // still ours
```

A `&` borrow is read-only. For changes you need `&mut`:

```rust
fn add_note(notes: &mut Vec<String>, note: &str) {
    notes.push(note.to_string());
}

let mut notes = Vec::new();
add_note(&mut notes, "vegan");
```

The compiler enforces one rule here: **many readers, or exactly one writer, never both at once**. It's the same rule that stops two threads fighting over the same data, and you'll lean on it in lesson 9.

## String and &str

You met these last lesson. A `String` owns its text and can grow. A `&str` is a borrowed view of text that lives somewhere else, either in your program's code or inside a `String`. Function parameters should nearly always be `&str`, since it accepts both: pass `"text"` or `&my_string`.

A `&[String]` does the same for lists, a borrowed view of a Vec. And a **slice** like `&text[0..5]` is a borrowed piece of a larger value.

## Your turn

Open `tests/checks.rs` first, then fill in `src/lib.rs`:

1. `greeting`: borrow a `&str` and build `Hello, <name>!` with `format!`.
2. `total_chars`: borrow the notes and add up each one's `.len()`.
3. `add_note`: borrow the list with `&mut` and push a note.
4. `into_upper`: take the `String` by value and return it in capitals.
5. `first_word`: return the part before the first space as a `&str`.

Then open `src/main.rs`, un-comment the line marked there and press Run. Read the compiler's complaint. Seeing that error on purpose now saves you from being puzzled by it later.

> Tip: when a borrow error confuses you, ask "who owns this, and who's using it right now?" The compiler's message nearly always answers exactly that.
