In Python you write `nights = 3` and move on. In Rust every value has a type that's fixed at compile time. You rarely have to write the type out, because the compiler infers it, but it's always there. That strictness is what lets Bramble's audio code run without surprises.

## Variables don't change unless you say so

```rust
let rate = 520;      // fixed
rate = 600;          // compile error!

let mut total = 0;   // `mut` makes it changeable
total = total + rate;
```

Everything is immutable by default. When you see `mut`, you know that value changes somewhere. It makes code easier to read, since the changing parts announce themselves.

## The types you'll use constantly

- Whole numbers: `u32` (never negative), `i32` (can be negative), `usize` (sizes and list positions). Pick `u32` for things like nights and dollars.
- Decimals: `f64`, and `f32` for audio samples (Bramble uses `f32` everywhere).
- `bool` for true or false, and `char` for one character.
- Strings: `&str` for text written in the code, `String` for text you build or change. Lesson 3 explains why there are two.

```rust
let nights: u32 = 3;    // you can spell the type out
let rate = 520;         // or let Rust infer it
let ratio = 0.5;        // an f64
```

## No automatic conversions

JavaScript happily adds a string to a number. Rust won't mix even two kinds of number. You convert on purpose with `as`:

```rust
let total: u32 = 1560;
let nights: u32 = 4;
let average = total as f64 / nights as f64;   // 390.0
```

`as` is blunt, so use it where you're sure. Rounding also needs a method: `(x * 1.1).round()`.

## if is an expression

`if` gives back a value, so you can use it on the right of a `let` or as a function's last line:

```rust
let label = if nights >= 5 { "long stay" } else { "short stay" };
```

No parentheses around the condition, and the braces are required.

## Functions

```rust
fn nightly_total(nights: u32, rate: u32) -> u32 {
    nights * rate        // no semicolon: this is the value returned
}
```

Parameter types are always written, and `-> u32` names the return type. Add a semicolon to that last line and you'd return nothing, which the compiler will point out.

## Your turn

This is the first lesson where **Check my work runs `cargo test`**. Open `tests/checks.rs` and read it. Each test calls your function with known inputs, just like `tests.py` in the Python track.

1. Open `src/lib.rs`. Each function body is `todo!()`, which compiles but crashes when called. Replace each one.
2. Write `nightly_total` and `with_gst` (use `as f64`, `.round()` and `as u32`).
3. Write `nights_label` with `if`, `else if` and `else`.
4. Write `stay_cost` with a `let mut total`, and `average_rate` with `as f64`.

> Tip: the unused-variable warnings you'll see on a fresh `todo!()` vanish as soon as you use each parameter.
