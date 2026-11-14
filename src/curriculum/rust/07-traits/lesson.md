A **trait** is a promise about what a type can do. If you know TypeScript interfaces, it's very close. If you know Python, think of an abstract base class, or just "anything with these methods", but checked before the program ever runs.

Bramble leans on this everywhere. A drum machine, a synth and a sampler are different types, but the engine only cares that each one can fill a buffer of samples. One trait, many instruments.

## Defining and implementing

```rust
trait Source {
    fn next_sample(&mut self) -> f32;
    fn name(&self) -> String;
}

struct Silence;

impl Source for Silence {
    fn next_sample(&mut self) -> f32 { 0.0 }
    fn name(&self) -> String { String::from("silence") }
}
```

The trait lists the methods. Each type then writes `impl Trait for Type` with its own versions. Forget one and the compiler tells you exactly which.

## Default methods

A trait can include ready-made methods built from the required ones:

```rust
trait Source {
    fn next_sample(&mut self) -> f32;
    fn name(&self) -> String;

    fn describe(&self) -> String {
        format!("source: {}", self.name())
    }
}
```

Every type that implements `Source` now has `.describe()` for free. A type can override it if it wants something different.

## Two ways to use a trait

**Generics** say "any type that implements this", and the compiler builds a specialised copy for each type. It's as fast as writing the code by hand.

```rust
fn peak<S: Source>(source: &mut S, count: usize) -> f32 { /* ... */ }
```

**Trait objects** (`dyn`) let different types sit in the same list, and the right method is picked while the program runs:

```rust
let mut sources: Vec<Box<dyn Source>> = vec![Box::new(Square::new(4)), Box::new(Ramp::new(0.25))];
```

`Box` puts each value on the heap. It's needed because a Square and a Ramp are different sizes, but a pointer to either is always the same size. It's a tiny bit slower than generics, so pick generics by default and `dyn` when you need a mixed collection. Bramble's rack of devices is exactly that.

## Traits you've already used

`#[derive(Debug, Clone)]` generates trait implementations for you. `Display` is what makes `{}` work in `println!`, and `Iterator` is what powers `.map()` and `.filter()` from last lesson. Traits are the glue of the whole standard library.

## Your turn

`src/lib.rs` has the `Source` trait and two structs, `Square` and `Ramp`. Open `tests/checks.rs` to see what they should produce, then:

1. Fill in `impl Source for Square`: 1.0 for the first half of its period, -1.0 for the second. Move `tick` on each sample and wrap it with `%`.
2. Fill in `impl Source for Ramp`: return the current value, then add `step`.
3. Write the generic `peak`, using the default `render` method.
4. Write `mix`, which adds one sample from each boxed source for every frame.

> Tip: in the tests, `describe` and `render` work on your types without you writing them. That's the default-method payoff.
