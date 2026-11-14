Rust has no `null` and no exceptions. Both are a famous source of bugs: the "undefined is not a function" crash in JavaScript, the `KeyError` in Python at 2am. Instead, Rust puts the possibility of absence or failure **into the type**, and the compiler won't let you forget about it.

## match

You met `match` in the last lesson. It checks a value against patterns, top to bottom:

```rust
match nights {
    1 => "one night",
    2..=4 => "short stay",     // a range
    _ => "long stay",          // _ means "anything else"
}
```

`match` is an expression, so it gives back a value. And it must be **exhaustive**: every possible value has to be covered, or it won't compile.

## Option: maybe there's a value

```rust
fn rate_for(room: &str) -> Option<u32> {
    match room {
        "Ocean Room" => Some(520),
        _ => None,
    }
}
```

`Option<u32>` is either `Some(520)` or `None`. You can't use it as a number until you've dealt with the `None` case:

```rust
match rate_for("Shed") {
    Some(rate) => println!("${rate}"),
    None => println!("no such room"),
}
```

It's the same job as a Python dict's `.get()` returning `None`, except Rust makes you check, every time.

## Result: it worked, or here's why not

```rust
fn parse_nights(text: &str) -> Result<u32, String> {
    match text.trim().parse::<u32>() {
        Ok(n) => Ok(n),
        Err(_) => Err(format!("'{text}' isn't a number")),
    }
}
```

`Result<good, bad>` is `Ok(value)` or `Err(reason)`. It's Rust's version of try/except, but visible right there in the function's signature. Anyone calling it knows it can fail.

## The ? shortcut

Writing a `match` for every step gets long. `?` says "if this failed, return that failure from my function now; otherwise give me the value":

```rust
fn quote(room: &str, nights: &str) -> Result<u32, String> {
    let rate = rate_for(room).ok_or("no such room")?;   // None becomes an Err
    let nights = parse_nights(nights)?;
    Ok(nights * rate)
}
```

You'll use `?` constantly. Your `bookings.csv` tool in lesson 11 leans on it.

## Two things to avoid

`.unwrap()` and `.expect("...")` open an Option or Result and crash if it was empty. They're fine in quick experiments and tests. In real code, handle the failure with `match` or `?`.

## Your turn

Fill in `src/lib.rs`:

1. `rate_for`: match on the room name, returning `Some(rate)` or `None`.
2. `describe_rate`: match on `rate_for(room)`, giving a sentence either way.
3. `parse_nights`: parse, turn a failure into the message the tests expect, and reject 0.
4. `quote`: chain `rate_for` and `parse_nights` using `?`.
5. `stay_type`: match with `1`, a range `2..=4` and `_`.

> Tip: `.ok_or(x)` is the bridge from Option to Result: `Some(v)` becomes `Ok(v)`, and `None` becomes `Err(x)`.
