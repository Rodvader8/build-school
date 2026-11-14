A MIDI keyboard doesn't send sound. It sends tiny messages: "key 60 pressed, hard". Your program turns that into a note. Bramble DAW does this with the `midir` crate for live input, and `midly` for importing `.mid` files. This lesson is the part in the middle: understanding the bytes.

**Turn your volume down before pressing Run.** This lesson makes no sound itself, but it's a good habit while you're building a synth around it.

## What a message looks like

Every MIDI message is two or three bytes. The first, the **status byte**, says what it is and which channel. The next one or two carry data, each from 0 to 127.

| Bytes | Means |
|---|---|
| `90 3C 7F` | note on, channel 1, note 60, velocity 127 |
| `80 3C 40` | note off, note 60 |
| `B0 01 40` | control change: the mod wheel (controller 1), halfway |
| `E0 00 40` | pitch bend: dead centre |

The high 4 bits of the status byte are the message type (`0x90`) and the low 4 are the channel. Masking with `status & 0xF0` keeps just the type. Bramble ignores the channel, and so do you.

## Quirks worth knowing

- **Velocity 0 means off.** Many keyboards send a note *off* as a note *on* with velocity 0, because it lets them skip repeating the status byte. Your parser treats the two the same.
- **Pitch bend is 14 bits.** The two data bytes are the low and high halves of one number, each only 7 bits wide: `(high << 7) | low`. The middle is 8192, so `(raw - 8192) / 8192` maps it to about -1 to 1.
- **Note numbers aren't frequencies.** 60 is middle C, 69 is the A at 440 Hz, and every 12 notes up doubles the frequency: `440 * 2^((note - 69) / 12)`.

## Live input with midir

`midir` lists ports, connects to one, and calls your closure for every message, on **its own thread**:

```rust
let input = midir::MidiInput::new("my-app")?;
let port = &input.ports()[0];
let _connection = input.connect(port, "in", |_time, bytes, _| {
    println!("{:?}", parse_midi(bytes));
}, ())?;
```

The connection stays open only while the returned value is alive, which is why it's bound to a name instead of being dropped. In a real synth the closure would push the event into an `rtrb` queue (lesson 6), and the audio thread would pick it up.

## Files with midly

A `.mid` file is the same messages with timestamps. Time is in **ticks**, and each event stores a *delta*, the ticks since the previous event. To find when a note starts, add the deltas up as you go. How long a tick lasts depends on the file's tempo, which is a story for another day.

The tests build a small MIDI file in memory with `midly`'s writer, so there's nothing on disk to find.

## Your turn

Fill in `src/lib.rs`:

1. `parse_midi`: raw bytes in, a `MidiEvent` or `None` out. Never panic on short or odd input.
2. `note_to_freq`: note number to hertz.
3. `notes_in_file`: parse a file and list `(tick, note)` for every note start, sorted by time.

Check my work uses fake messages, so it works with no keyboard. Run listens for 15 seconds if you have one plugged in.

> A parser that returns `Option` is better than one that panics. You'll get strange bytes from real hardware sooner or later.
