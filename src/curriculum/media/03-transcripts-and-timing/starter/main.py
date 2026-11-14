import json
from pathlib import Path


def format_time(seconds, sep=","):
    """1.5 -> "00:00:01,500" (SRT uses a comma; pass sep="." for WebVTT)."""
    ms = round(seconds * 1000)
    hours, ms = divmod(ms, 3_600_000)
    minutes, ms = divmod(ms, 60_000)
    secs, ms = divmod(ms, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02}{sep}{ms:03}"


def parse_time(text):
    """An SRT time as seconds: "00:01:02,250" -> 62.25."""
    pass


def parse_srt(text):
    """Read SRT text into a list of (start_seconds, end_seconds, text). Cope with \\r\\n line endings,
    cues that have two lines (keep the \\n between them), and a missing blank line at the end."""
    pass


def to_vtt(cues):
    """cues is a list of (start, end, text). Return WebVTT text: a WEBVTT line, a blank line, then each cue
    as "start --> end" and its text (no numbers), with a blank line between cues. Times use a full stop."""
    pass


def words_to_cues(words, max_chars=32, max_gap=0.8):
    """words is a list of {"word", "start", "end"}. Group them into (start, end, text) cues.
    Start a new cue when the previous word ended a sentence (. ? !), when the pause since the previous word
    is longer than max_gap seconds, or when adding the word would make the text longer than max_chars."""
    pass


def cues_for_clip(cues, start, end):
    """The cues that overlap the clip window start..end, moved so the clip begins at 0 and trimmed to fit
    (0 to end - start). A cue that only touches the edge is dropped. Round times to 3 decimals."""
    pass


def load_words(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))
