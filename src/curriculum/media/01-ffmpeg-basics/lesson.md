A podcast clip tool, a batch resizer for social posts, a script that trims the dead air off a recording: underneath, they're all **ffmpeg**. It's a command-line program that reads, converts, cuts and joins almost any audio or video file. You'll rarely type its commands by hand in a finished tool. You'll build them in Python and run them, which is what this lesson does.

## Look before you cut: ffprobe

`ffprobe` ships with ffmpeg and tells you what's in a file:

```bash
ffprobe -v error -print_format json -show_streams -show_format clip.mp4
```

The answer is JSON: a list of **streams** (one video, maybe one audio) and a **format** block with the duration. Python reads it with `json.loads`. Always probe before you assume a clip has sound or a particular size.

## Cut

```bash
ffmpeg -y -ss 1 -i in.mp4 -t 2 -c:v libx264 -c:a aac out.mp4
```

Read it left to right. `-y` overwrite without asking. `-ss 1` start one second in. `-i in.mp4` the input. `-t 2` keep two seconds. The codecs then say how to re-encode. Put `-ss` before `-i` and ffmpeg jumps straight there, which is fast and, when re-encoding, still accurate.

You can copy without re-encoding (`-c copy`), which is instant but can only cut at certain points, so the start may land a little early. Re-encoding is slower and exact. For short clips, exact wins.

## Join

Joining uses the **concat** feature and a list file:

```
file '/full/path/one.mp4'
file '/full/path/two.mp4'
```

```bash
ffmpeg -y -f concat -safe 0 -i list.txt -c copy joined.mp4
```

`-c copy` works here because both clips share the same settings. If they don't (different size or codec), you'd have to re-encode. Use full paths in the list and put them in single quotes, or a file name with a space breaks it.

## Resize

```bash
ffmpeg -y -i in.mp4 -vf scale=640:-2 -c:a copy out.mp4
```

`scale=640:-2` means "640 wide, and work out the height to keep the shape, rounded to an even number". Video codecs need even sizes, so `-2` is safer than `-1`.

## Running it from Python

Pass the command as a **list**, never a single string:

```python
subprocess.run(["ffmpeg", "-y", "-i", src, "-vf", "scale=640:-2", dst], check=True)
```

A list means a name like `my clip.mp4` stays one argument, and nobody's file name can sneak in a shell command. `check=True` turns a failed ffmpeg into a Python error. `main.py` gives you a `run()` that does both and shows ffmpeg's own message when it fails.

## Your turn

The tests make small clips for you (320x240, a few seconds, with a test picture and a beep), so you don't need any files. Open `main.py` and fill in four functions.

1. `probe(path)` returns `{"width", "height", "duration", "has_audio"}`.
2. `cut(src, dst, start, duration)` re-encodes just that slice.
3. `join(clips, dst)` joins clips with a concat list written to a temporary folder.
4. `resize(src, dst, width)` scales to that width and keeps the audio.

> Add `-hide_banner -loglevel error` to quieten ffmpeg when you run it yourself. `run()` already captures the noise.
