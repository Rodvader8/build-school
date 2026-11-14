Captions start with a transcript: the words, and *when* each one was said. This lesson is about working with that. Reading it, writing it in the right format, chopping a long stream of words into readable caption lines, and moving the timing when you pull a short clip out of a long recording.

## Where a transcript comes from

A speech-to-text model such as **Whisper** listens to the audio and returns the words with start and end times. You can run it on your own machine (optional, and not needed for this lesson):

```bash
pip install faster-whisper
```

```python
from faster_whisper import WhisperModel

model = WhisperModel("base")
segments, info = model.transcribe("talk.mp3", word_timestamps=True)
for segment in segments:
    for word in segment.words:
        print(word.start, word.end, word.word)
```

The command-line `pip install openai-whisper` does a similar job and can write an SRT file for you directly. Models are downloaded the first time and can be slow without a graphics card, so for this lesson a ready-made `transcript.json` stands in for the model's output. Everything after the transcription step works identically on either.

```json
{"word": "Hello", "start": 0.18, "end": 0.45}
```

## SRT in, VTT out

You wrote SRT in the last lesson. **Reading** it means undoing the same steps: split the file into blocks on blank lines, then split each block into its number, its time range and its text. Be ready for Windows line endings (`\r\n`), cues with two lines, and a missing blank line at the very end. Real caption files have all three.

**WebVTT** (`.vtt`) is the web's version, used by the `<track>` element in a video tag. It differs in only a few ways: the file starts with the line `WEBVTT`, there are no cue numbers, and times use a **full stop** before the milliseconds, `00:00:01.500`.

## Words into caption lines

A word list isn't a caption file. Nobody wants a caption per word, or a 40-word wall of text. You decide where a cue ends:

- When a **sentence** finishes (the word ends in `.`, `?` or `!`).
- When there's a long **pause**, so the caption doesn't hang on screen through silence.
- When the line would get too **long** to read at a glance. About 32 characters suits a phone.

Each cue starts when its first word starts and ends when its last word ends. Three simple rules, and the result reads naturally.

## Cutting a clip means moving the captions

Say the best 20 seconds of a talk run from 95s to 115s. After you cut that clip, its first frame is time 0. The caption that was at 97s must now appear at 2s. You also need to drop captions outside the window, and trim any that only partly overlap: the clip can start or end mid-sentence.

```
caption  97 -> 101   in clip starting at 95:   2 -> 6
caption  90 -> 96    clipped:                  0 -> 1
caption 115 -> 118   starts as the clip ends:  dropped
```

This one function is what makes a clip tool possible.

## Your turn

`format_time` is given to you (it takes the separator as an option). Fill in the other five in `main.py`.

1. `parse_time("00:01:02,250")` gives `62.25`.
2. `parse_srt(text)` gives a list of `(start, end, text)` tuples. Multi-line text keeps its `\n`.
3. `to_vtt(cues)` returns the WebVTT text.
4. `words_to_cues(words, max_chars=32, max_gap=0.8)` builds cues from the word list.
5. `cues_for_clip(cues, start, end)` returns the cues inside the window, shifted so the clip starts at 0.

> Round the shifted times to 3 decimals so floating-point dust like 0.30000000000000004 never reaches a caption file.
