# tests.py: Check my work runs this file. Read it, but don't change it.
# Pure Python: no ffmpeg and no speech model needed. transcript.json is a ready-made word list.
try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


check("parse_time reads SRT times", lambda: main.parse_time("00:00:00,500") == 0.5 and main.parse_time("00:01:02,250") == 62.25 and abs(main.parse_time("01:02:03,004") - 3723.004) < 1e-9)

SRT = "1\r\n00:00:00,500 --> 00:00:02,500\r\nHello there\r\n\r\n2\r\n00:01:02,250 --> 01:00:00,000\r\nLine one\r\nLine two\r\n"
check("parse_srt reads cues", lambda: main.parse_srt(SRT) == [(0.5, 2.5, "Hello there"), (62.25, 3600.0, "Line one\nLine two")])

check("to_vtt writes WebVTT", lambda: main.to_vtt([(0.5, 2.5, "Hello there"), (62.25, 64, "Line one\nLine two")]).strip() == "WEBVTT\n\n00:00:00.500 --> 00:00:02.500\nHello there\n\n00:01:02.250 --> 00:01:04.000\nLine one\nLine two")


def word(text, start, end):
    return {"word": text, "start": start, "end": end}


WORDS = [word("Hello", 0, 0.4), word("and", 0.4, 0.6), word("welcome.", 0.6, 1.2), word("Today", 1.3, 1.7), word("we", 1.7, 1.8),
         word("talk", 1.8, 2.1), word("about", 2.1, 2.5), word("cron", 3.6, 4.0), word("jobs", 4.0, 4.4)]

check("cues break at sentence ends", lambda: main.words_to_cues(WORDS, max_chars=20)[0] == (0, 1.2, "Hello and welcome."))
check("cues break at pauses and length", lambda: main.words_to_cues(WORDS, max_chars=20) == [(0, 1.2, "Hello and welcome."), (1.3, 2.5, "Today we talk about"), (3.6, 4.4, "cron jobs")]
      and main.words_to_cues(WORDS, max_chars=12) == [(0, 0.6, "Hello and"), (0.6, 1.2, "welcome."), (1.3, 1.8, "Today we"), (1.8, 2.5, "talk about"), (3.6, 4.4, "cron jobs")])


def real_transcript():
    words = main.load_words("transcript.json")
    cues = main.words_to_cues(words)
    same_words = " ".join(text for _, _, text in cues).split() == [w["word"] for w in words]
    short = all(len(text) <= 32 for _, _, text in cues)
    in_order = all(a[1] <= b[0] and a[0] < a[1] for a, b in zip(cues, cues[1:]))
    return len(cues) > 5 and same_words and short and in_order


check("no words lost from the real transcript", real_transcript)

CUES = [(0, 2, "A"), (2, 4, "B"), (4, 6, "C"), (6, 8, "D")]
check("cues_for_clip shifts and trims", lambda: main.cues_for_clip(CUES, 3, 7) == [(0, 1, "B"), (1, 3, "C"), (3, 4, "D")])
check("cues_for_clip ignores edge cues", lambda: main.cues_for_clip(CUES, 2, 4) == [(0, 2, "B")] and main.cues_for_clip(CUES, 0, 2) == [(0, 2, "A")])
