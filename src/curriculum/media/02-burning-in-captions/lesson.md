Most short videos are watched with the sound off, so a podcast clip tool lives or dies on its captions. There are two kinds. **Soft** captions travel beside the video as a track a viewer can switch on or off. **Burned-in** (or hard) captions are painted straight onto the picture, so they show everywhere, in every app, every time. Social clips almost always use burned-in. This lesson builds both halves: the caption file, and the ffmpeg step that paints it on.

## The SRT format

SRT is the plainest caption format there is. A text file of numbered cues:

```
1
00:00:00,500 --> 00:00:02,500
Hello and welcome.

2
00:00:02,600 --> 00:00:05,000
Today: burning in captions.
```

Number, a time range, the text, a blank line. Times are `hours:minutes:seconds,milliseconds`, with a **comma** before the milliseconds (the web's sibling format, VTT, uses a full stop; you'll meet it next lesson).

In Python you'll hold a cue as a tuple `(start, end, text)` with times in seconds. Converting seconds to that string is the fiddly part:

```python
ms = round(seconds * 1000)         # work in whole milliseconds
hours, ms = divmod(ms, 3_600_000)
minutes, ms = divmod(ms, 60_000)
secs, ms = divmod(ms, 1000)
f"{hours:02}:{minutes:02}:{secs:02},{ms:03}"
```

Rounding **first** matters. If you split the float into pieces and round the milliseconds last, 59.9996 seconds becomes `00:00:59,1000`, which isn't a time.

Write the file as UTF-8 so accents and apostrophes survive.

## Burning with ffmpeg

```bash
ffmpeg -i clip.mp4 -vf "subtitles=captions.srt:force_style='FontSize=24,Alignment=2,MarginV=40'" -c:a copy out.mp4
```

`-vf` is the video filter. `subtitles=` renders the file onto each frame, and `force_style` sets the look: `FontSize`, `Alignment=2` (bottom centre) and `MarginV` (distance up from the bottom edge). `-c:a copy` leaves the audio untouched. Burning means the video is re-encoded, so it's slower than a cut.

One snag: filter arguments are parsed by ffmpeg itself, and a path with a colon, a space or a quote in it needs awkward escaping. The easy way round is to run ffmpeg *in the caption file's folder* and refer to it by its plain name. The catch is that the input and output paths must now be absolute, because "here" has moved.

## Checking it worked

How do you test that text is on screen? Grab single frames with ffmpeg as raw grey pixels and count the bright ones. On a black test video, white captions make bright pixels: none before the caption starts, plenty during it, none after. The same trick tells you *where* the text is. That's how the checks here work, and it's a handy way to test any visual output.

## Your turn

1. `format_time(seconds)`: seconds to `HH:MM:SS,mmm`.
2. `write_srt(cues, path)`: write cues as `(start, end, text)` tuples to an SRT file, numbered from 1.
3. `burn_captions(video, srt, out, font_size=24, margin=40)`: burn the captions in at the bottom centre, keeping the audio.

The tests make a little black video and a caption file for you.

> Real tools run Whisper to get the words and timestamps, then reuse everything you've just written. That's next lesson.
