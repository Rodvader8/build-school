You've written this tool before. In the Python track you read `bookings.csv`, summarised it and saved `summary.json`. Now you'll write the same thing in Rust, so you can see the two languages side by side. Keep your Python `main.py` open next to this one. Spotting what's the same and what's different is half the point.

## What's changed from Python

**The shape is identical.** Read the file, turn each row into a record, add things up, write JSON, print one line. The functions even have the same jobs.

**Records are structs.** Python used a dict per row (`row["nights"]`), and a typo in the key only showed up at runtime. Here a `Booking` struct has named, typed fields (`booking.nights`), so a typo won't compile.

**Failure is in the type.** Python's `int(row["nights"])` raises `ValueError` if a cell says "three". In Rust, `parse_bookings` returns `Result<Vec<Booking>, String>`, and the bad row becomes `Err("line 2: 'three' isn't a number")`. Callers can't ignore it, and `?` passes it up the chain.

**No csv library.** A plain split on commas is enough for this file, and it shows you the loop. For real-world CSVs with quoted commas, you'd add the `csv` crate: one line in `Cargo.toml`, as in lesson 8.

**Ordered output.** A `HashMap` has no order (lesson 6), so rooms in `by_room` use a `BTreeMap`, which keeps keys alphabetical. Same idea as Python dicts remembering insertion order, with a different rule.

## The layout

You know this one from lessons 8 and 10:

- `src/lib.rs`: the real work, in small functions you can test.
- `src/main.rs`: a tiny wrapper that calls `run` and handles errors. It's finished already.
- `tests/checks.rs`: runs your functions, and also the finished program in an empty folder, with a copy of `bookings.csv`, exactly as you'd use it.

Open `main.rs` and notice how short it is. A good command-line tool is mostly a library with a thin front door. When something goes wrong, it prints `Error: ...` to **stderr** and exits with code 1, the Unix way of saying "failed". It never panics.

## The one new thing: map_err

Reading a file gives an `io::Error`, but your functions return `Result<_, String>`. `.map_err` converts the error, and `?` returns it early:

```rust
let text = std::fs::read_to_string(path)
    .map_err(|e| format!("can't read {}: {e}", path.display()))?;
```

Read it as "try to read the file, and if that fails, describe it in my words and return it".

## Your turn

Work through `src/lib.rs` from the top. Every function has a hint in its comment, and `tests/checks.rs` shows exactly what each should do.

1. `format_money`: copy it from lesson 8.
2. `parse_bookings`: skip the header, split each line, parse the numbers, and report bad lines with their number.
3. `summarise`: loop once, adding nights and per-room revenue with `entry().or_insert(0)`.
4. `summary_to_json`: build it with `serde_json::json!` and `to_string_pretty`.
5. `run`: chain it all together, with `?` and `map_err`. Press Run to see `6 bookings, $9,680 revenue` and a new `summary.json`.

When you're done, compare it with your Python version. Which parts felt shorter, and which felt safer?

> Tip: the missing-file test runs the program in an empty folder. If it passes, you've built a tool that fails politely, which is most of what separates a script from a tool.
