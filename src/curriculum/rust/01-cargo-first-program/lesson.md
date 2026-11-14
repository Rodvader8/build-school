Rust is the language Bramble is written in. It's compiled, which means a program called the compiler reads all your code first, refuses to build it if anything looks unsafe, and then turns it into a native program that runs flat out. No interpreter, no runtime. That's why an audio engine can run in it without crackling.

It's a different feel from Python, where you run a file and find mistakes as they happen. In Rust the compiler finds them before anything runs. It will feel strict for the first week. Then it starts to feel like a very fussy friend who's always right.

## cargo: your project manager

You won't call the compiler directly. You use **cargo**, which makes projects, downloads libraries, builds and runs. Think of it as npm and pip rolled into one, plus the build step.

```bash
cargo new hello       # makes a project folder
cargo run             # build it, then run it
cargo build --release # the slow, fully optimised build
```

A cargo project is a folder with two things that matter:

- `Cargo.toml` - the name, edition and dependencies. It's your `package.json`.
- `src/main.rs` - where the program starts, in a function called `main`.

Open both in the Explorer. The **edition** (2024) is the version of the language rules, and you can leave it alone.

## Your first lines

```rust
fn main() {
    println!("Hello, world!");
}
```

`fn` declares a function. The `!` after `println` means it's a **macro**, not a normal function. Macros can do things functions can't, like taking any number of values. Strings go in double quotes, and statements end with a semicolon.

To print values, put `{}` holes in the string:

```rust
let nights = 3;
println!("{nights} nights");        // the name goes inside the braces
println!("Total: ${}", nights * 520); // or the value comes after
```

`let` makes a variable. You didn't have to say it was a number: Rust worked that out. More on that next lesson.

When you press Run, the app runs `cargo run` in this folder. The first build takes a little while. After that it's quick.

## Your turn

1. In `src/main.rs`, change the greeting so it prints `Hello, Sam!`.
2. Add `let nights = 3;` and `let rate = 520;`.
3. Print `3 nights at $520 = $1560` using those two variables. Work the total out with `nights * rate` inside the `println!`.
4. Press Run, then Check my work.

> Tip: if the compiler complains, read the message from the top. Rust's errors are famously good: they show the exact line, underline the problem and often tell you the fix.
