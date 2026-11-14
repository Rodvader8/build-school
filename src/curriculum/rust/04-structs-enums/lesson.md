Python has classes and JavaScript has objects. Rust splits the job in two: **structs** hold data together, and **enums** say "it's exactly one of these". Bramble is built from both. A track is a struct with a volume, a pan and a name. A waveform is an enum: sine, saw, square or triangle.

## Structs

```rust
struct Booking {
    guest: String,
    nights: u32,
    rate: u32,
}

let booking = Booking { guest: String::from("M. Okafor"), nights: 3, rate: 520 };
println!("{}", booking.nights);
```

Fields are named, typed and fixed. There's no adding a property later like you can on a JavaScript object. `pub` in front of a field means code in other modules can read it too (lesson 8).

## Methods live in an impl block

```rust
impl Booking {
    fn new(guest: &str, nights: u32) -> Booking {      // no self: called as Booking::new(...)
        Booking { guest: guest.to_string(), nights, rate: 520 }
    }

    fn total(&self) -> u32 {                            // &self: borrows the booking
        self.nights * self.rate
    }
}
```

Methods that take `&self` are like Python's `self` methods: `booking.total()`. Ones without `self` are "associated functions", and `Booking::new` is the usual way to build a struct. (Rust has no constructors, only a naming habit.)

Remember lesson 3: `&self` borrows to read, `&mut self` borrows to change.

## Enums

```rust
enum Room {
    Ocean,
    Garden,
    Cliff,
}

let room = Room::Cliff;
```

A value of type `Room` is always one of those three. No typos like `"Ocen"`, which a string would let slide through.

To use an enum, you `match` on it:

```rust
fn rate(room: &Room) -> u32 {
    match room {
        Room::Ocean => 520,
        Room::Garden => 380,
        Room::Cliff => 760,
    }
}
```

The compiler insists every variant is covered. Add a fourth room next month and every `match` that forgot it stops compiling, which is a lovely way to find all the places you need to update. Lesson 5 goes deep on `match`.

## derive

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Room { Ocean, Garden, Cliff }
```

`#[derive(...)]` asks the compiler to write boring code for you. `Debug` lets you print with `{:?}`, `Clone` and `Copy` make duplicating cheap, and `PartialEq` allows `==`. You'll see derive on nearly every type in Bramble.

## Your turn

The `Room` enum and `Booking` struct are already written in `src/lib.rs`. You write the methods:

1. `Room::rate`: a `match self` giving 520, 380 or 760.
2. `Room::name`: "Ocean Room", "Garden Room" or "Cliff Suite".
3. `Booking::new`: build the struct, taking the rate from the room.
4. `Booking::total` and `Booking::summary`, which should give `J. Lindqvist: Garden Room, 2 nights, $760`.

> Tip: run the app first (src/main.rs). It will crash on the first `todo!()`, and the crash message tells you the exact file and line to fix next.
