use cpal_08_midi::*;
use std::time::Duration;

// Run this with a MIDI keyboard or pad plugged in. It listens for 15 seconds and prints what you play.
// With nothing plugged in it says so and stops. It makes no sound itself.
fn main() -> Result<(), String> {
    let input = midir::MidiInput::new("build-school").map_err(|e| format!("couldn't start MIDI: {e}"))?;
    let ports = input.ports();
    let Some(port) = ports.first() else {
        println!("No MIDI input devices found. Plug one in and press Run again.");
        return Ok(());
    };
    println!("Listening to {}", input.port_name(port).unwrap_or_else(|_| "a MIDI device".to_string()));

    // The callback runs on midir's own thread. Parsing is cheap and allocation-free, so it's fine here.
    let _connection = input
        .connect(
            port,
            "build-school-in",
            move |_timestamp, bytes, _| match parse_midi(bytes) {
                Some(MidiEvent::NoteOn { note, velocity }) => println!("note on {note} ({:.1} Hz) at {velocity:.2}", note_to_freq(note)),
                Some(other) => println!("{other:?}"),
                None => {}
            },
            (),
        )
        .map_err(|e| format!("couldn't connect: {e}"))?;

    std::thread::sleep(Duration::from_secs(15));
    println!("Done");
    Ok(())
}
