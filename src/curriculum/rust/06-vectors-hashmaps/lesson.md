Lists and dictionaries are everywhere in your Python tools: the rows of `bookings.csv`, the dict of revenue per room. Rust has the same two ideas as `Vec` and `HashMap`, plus a very tidy way of looping and transforming that you'll come to like.

## Vec: a growable list

```rust
let mut nights = vec![3, 2, 5];   // vec! is a macro that builds a Vec
nights.push(4);
println!("{}", nights.len());     // 4
println!("{}", nights[0]);        // 3
```

Every item has the same type, so this is a `Vec<i32>`, not a mixed bag like a Python list. (Mixed bags come from enums, in lesson 4's style.) Indexing past the end, like `nights[10]`, panics. For a safe version use `nights.get(10)`, which gives an `Option`, so lesson 5 pays off already.

Functions that only read a list should take a **slice**, `&[u32]`. It accepts a Vec or an array, and it's a borrow, so lesson 3 applies.

## Loops

```rust
for night in &nights {            // borrow, so nights is still usable afterwards
    println!("{night}");
}
```

`for item in list` without the `&` would move the whole list into the loop and you couldn't use it again.

## Iterators: filter, map, collect

The Rust way to transform a list is a chain, a bit like JavaScript's array methods or a Python comprehension:

```rust
let long: Vec<u32> = nights
    .iter()
    .filter(|n| **n >= 5)      // keep some
    .copied()                  // turn &u32 into u32
    .collect();                // gather into a new Vec

let total: u32 = nights.iter().sum();
```

`|n| ...` is a **closure**, the equivalent of an arrow function. The `**` is there because `.iter()` hands you references and `filter` adds another layer. When the compiler grumbles about `&` and `*`, it's usually this. The error tells you which.

Nothing happens until `.collect()` or `.sum()` finishes the chain. Iterators are lazy, and they compile down to the same speed as a hand-written loop.

## HashMap: a dictionary

```rust
use std::collections::HashMap;

let mut totals: HashMap<String, u32> = HashMap::new();
totals.insert(String::from("Ocean Room"), 1560);
println!("{:?}", totals.get("Ocean Room"));     // Some(1560)
```

`.get` gives an `Option`, so a missing key can't crash you. For the "add to a running total" job, which you did with `.get(key, 0) + amount` in Python, Rust has the `entry` API:

```rust
*totals.entry(room.to_string()).or_insert(0) += amount;
```

Read it as: find the entry for this room, create it as 0 if it's missing, then add to it. The leading `*` reaches through the reference to the number itself.

One more thing: a HashMap has no order. If you print it or loop over it, the order can change from run to run. To get a stable order, collect the keys and `.sort()` them.

## Your turn

Fill in `src/lib.rs`, with hints in the comments above each function:

1. `total_nights` with `.iter().sum()`.
2. `long_stays` with `.filter()`.
3. `with_gst_all` with `.map()`.
4. `revenue_by_room` with a loop and `entry().or_insert(0)`.
5. `top_room` with `.max_by_key()`.
6. `rooms_sorted` with `.keys()` and `.sort()`.

> Tip: if you can't work out what type a chain produces, let the compiler tell you. Write `let x: () = your_chain;` and the error shows the real type.
