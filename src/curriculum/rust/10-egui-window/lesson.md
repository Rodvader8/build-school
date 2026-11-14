Time to put a window on the screen. Bramble's whole interface is built with **egui**, a Rust library for drawing buttons, sliders and knobs, and **eframe**, which opens the actual window and runs the loop. You're about to build a tiny mixer in that exact style.

## Immediate mode: a different way to think

In HTML you build a tree of elements once, then change them when things happen. egui does the opposite. Every frame, about 60 times a second, your code runs top to bottom and **draws the whole UI again**. A button isn't an object that lives somewhere. It's a function call that draws one and tells you right now whether it was clicked:

```rust
if ui.button("Mute").clicked() {
    self.mixer.toggle_mute();
}
```

That's the whole event system. No listeners, no state tree to keep in sync. If a value changes, the next frame just draws the new one.

## An app is a struct with a ui method

```rust
struct MixerApp { mixer: Mixer }

impl eframe::App for MixerApp {
    fn ui(&mut self, ui: &mut egui::Ui, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ui, |ui| {
            ui.heading("Mini mixer");
            ui.label("hello");
        });
    }
}
```

`eframe::App` is a trait (lesson 7). You implement `ui`, and eframe calls it every frame. The `&mut self` means you can change your state right there, and it's the same ownership rules as ever.

Then `main` opens the window:

```rust
fn main() -> eframe::Result {
    let options = eframe::NativeOptions::default();
    eframe::run_native("Mini mixer", options, Box::new(|_cc| Ok(Box::new(MixerApp { mixer: Mixer::new() }))))
}
```

## Keep the logic out of the window

Look at the folder. All the rules (volume limits, mute, tempo range) are in `src/lib.rs` in a plain `Mixer` struct. `src/main.rs` only draws it. That split is the most useful habit in this lesson, for two reasons:

- You can test the rules without opening a window. That's what `cargo test` does here. There's no screen in a test, but there doesn't need to be.
- The same `Mixer` could drive a different window, or a command-line tool, or the audio thread from lesson 9.

Bramble is organised the same way. The window code is the thin top layer.

## Widgets you'll use

- `ui.label("text")` and `ui.heading("text")`
- `ui.button("text").clicked()`
- `ui.add(egui::Slider::new(&mut value, 0.0..=1.0))` for a slider on an `f32`
- `ui.horizontal(|ui| { ... })` to lay things out in a row
- `ui.checkbox(&mut flag, "label")`

A slider edits an `f32` directly, which would skip your clamping. So the starter copies the value out, lets the slider change the copy, and passes it to `set_volume`. It's a small pattern with a big payoff: your rules stay in one place.

## Your turn

The first build compiles eframe and a lot of friends, so it can take a few minutes. After that it's quick.

1. In `src/lib.rs`, write `set_volume` with `.clamp(0.0, 1.0)`, and `toggle_mute`.
2. Write `output_gain`, `nudge_tempo` (sum as `i32`, clamp, convert back) and `level_label`.
3. In `src/main.rs`, add a **Mute** button that calls `toggle_mute`. Copy the shape of the tempo buttons.
4. Try it for real: in the terminal, run `cargo run` and a window opens. Click everything.

> Tip: Check my work can't open a window, so it tests the logic and looks for your button in the code. The window itself is yours to play with.
