# tests.py: Check my work runs this file. Read it, but don't change it.
# It makes a tiny black video with a beep, burns your captions in, then looks at single frames
# (as raw grey pixels) to see whether, when and where text appeared. Everything is in a temp folder.
import json
import subprocess
import tempfile
from pathlib import Path

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


W, H = 320, 240


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)], capture_output=True, text=True, check=True).stdout
    info = json.loads(out)
    video = next(s for s in info["streams"] if s["codec_type"] == "video")
    return video["width"], video["height"], float(info["format"]["duration"]), any(s["codec_type"] == "audio" for s in info["streams"])


def bright_pixels(path, at):
    """(count of bright pixels, average row of those pixels as a fraction of the height) in the frame at `at` seconds."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(at), "-i", str(path), "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    rows = [i // W for i, value in enumerate(raw) if value > 128]
    return len(rows), (sum(rows) / len(rows) / H if rows else 0)


tmp = Path(tempfile.mkdtemp()) / "caption test"  # a space in the folder name on purpose
tmp.mkdir()
source = tmp / "black.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:size={W}x{H}:rate=25:duration=3", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=44100:duration=3",
                "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "aac", str(source)], check=True)

check("format_time writes SRT times", lambda: (main.format_time(0), main.format_time(1.5), main.format_time(3661.25)) == ("00:00:00,000", "00:00:01,500", "01:01:01,250"))
check("format_time carries on rounding", lambda: main.format_time(59.9996) == "00:01:00,000")

srt = tmp / "captions.srt"
cues = [(0.5, 2.5, "HELLO WORLD")]
main.write_srt([(0.5, 2.5, "Hello there"), (2.6, 5, "Second one")], srt)
check("write_srt makes a valid file", lambda: srt.read_text(encoding="utf-8").strip() == "1\n00:00:00,500 --> 00:00:02,500\nHello there\n\n2\n00:00:02,600 --> 00:00:05,000\nSecond one")
accents = tmp / "accents.srt"
main.write_srt([(0, 1, "Café is ready\nsecond line")], accents)
check("write_srt keeps accents and line breaks", lambda: accents.read_bytes().decode("utf-8").strip() == "1\n00:00:00,000 --> 00:00:01,000\nCafé is ready\nsecond line")

main.write_srt(cues, srt)
burned = tmp / "burned.mp4"
main.burn_captions(source, srt, burned)
w, h, duration, has_audio = probe(burned)
check("burn keeps size, length and audio", lambda: (w, h) == (W, H) and abs(duration - 3.0) < 0.2 and has_audio)

before, _ = bright_pixels(burned, 0.1)
during, row = bright_pixels(burned, 1.5)
after, _ = bright_pixels(burned, 2.8)
check("captions appear on time", lambda: before == 0 and during > 40 and after == 0)
check("captions sit at the bottom", lambda: row > 0.6)

high = tmp / "high.mp4"
main.burn_captions(source, srt, high, margin=110)
_, high_row = bright_pixels(high, 1.5)
check("margin moves captions up", lambda: 0 < high_row < row - 0.1)

big = tmp / "big.mp4"
small = tmp / "small.mp4"
main.burn_captions(source, srt, big, font_size=40)
main.burn_captions(source, srt, small, font_size=14)
check("font_size changes the text", lambda: bright_pixels(big, 1.5)[0] > bright_pixels(small, 1.5)[0] * 2)
