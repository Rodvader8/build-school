Your Python scripts grew past one file in the packages lesson: `import`, a venv, `pip install`. Rust has the same shape, with sturdier names. Bramble has dozens of source files, and they're all organised with what you're about to learn.

## Modules: splitting code into files

A **module** is a named bucket of code. Declare it in `src/lib.rs` (or `main.rs`) with `mod`, and Rust loads the file of the same name:

```rust
// src/lib.rs
pub mod money;     // loads src/money.rs
pub mod rooms;     // loads src/rooms.rs
```

```rust
// src/money.rs
pub fn format_money(amount: u32) -> String { /* ... */ }
```

Unlike Python, where every file is importable by default, in Rust nothing is visible outside its module unless you mark it `pub`. Forgetting `pub` is the most common first error here, and the message says "is private".

## use: bringing names in

```rust
use rust_08_modules::money::format_money;    // now just call format_money(...)
use rust_08_modules::rooms;                  // now call rooms::nightly_rate(...)
```

`use` is a shortcut, the same as Python's `from money import format_money`. The path starts at the crate's name, then goes through the modules.

## Crates: the package unit

A **crate** is one compiled library or program. Your project is a crate. Everything on crates.io, the public library shelf, is a crate too. Bramble uses `cpal` for audio, `eframe` for the window, `rtrb` for ring buffers and `serde` for saving projects.

To use one, add a line to `Cargo.toml`:

```toml
[dependencies]
serde_json = "1"
```

The next `cargo build` downloads and compiles it. There's no venv to activate and no `requirements.txt` to keep in sync, because `Cargo.toml` is the list, and `Cargo.lock` pins exact versions (that's `package-lock.json`).

Then call into it by its path:

```rust
let text = serde_json::json!({ "bookings": 2 }).to_string();
```

## lib.rs plus main.rs

Look at the folder. `src/lib.rs` is the **library**: the real work, in modules. `src/main.rs` is a thin program that uses it. The tests in `tests/` use the library from outside too. That's the layout Bramble follows, and it makes code easy to test. Same idea as Python's `if __name__ == "__main__"`, just made structural.

## Your turn

`rooms.rs` is finished as a model. In this crate:

1. In `src/money.rs`, write `format_money` so `13200` becomes `$13,200`. Convert to a string, then loop over the characters with `.chars().enumerate()` and push a comma at the right spot.
2. In `Cargo.toml`, add `serde_json = "1"` under `[dependencies]`.
3. In `src/report.rs`, write `summary_json` with `serde_json::json!`. Press Run on `src/main.rs` to see your results.

The first build with a new dependency takes a moment. Everything is cached after that.

> Tip: `cargo add serde_json` in the terminal does step 2 for you.
