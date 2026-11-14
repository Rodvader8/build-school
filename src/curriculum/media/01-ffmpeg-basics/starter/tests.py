# tests.py: Check my work runs this file. Read it, but don't change it.
# It makes its own tiny test clips with ffmpeg (a test picture with a moving counter, and a beep)
# in a temporary folder, so there are no files to download and nothing is left behind.
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


def make_clip(path, seconds, source="testsrc", audio=True):
    command = ["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"{source}=size=320x240:rate=25:duration={seconds}"]
    if audio:
        command += ["-f", "lavfi", "-i", f"sine=frequency=440:sample_rate=44100:duration={seconds}"]
    command += ["-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p"]
    command += ["-c:a", "aac"] if audio else ["-an"]
    subprocess.run(command + [str(path)], check=True)


def first_frame_bytes(path):
    """The first frame as raw grey pixels, to tell which part of a clip we're looking at."""
    return subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-frames:v", "1", "-vf", "scale=32:24", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout


def close(a, b, tolerance):
    return abs(a - b) <= tolerance


tmp = Path(tempfile.mkdtemp())
three = tmp / "three seconds.mp4"  # a space in the name on purpose
two = tmp / "two seconds.mp4"
silent = tmp / "silent.mp4"
make_clip(three, 3)
make_clip(two, 2, source="smptebars")
make_clip(silent, 1, audio=False)

info = main.probe(three)
check("probe reads the facts", lambda: info["width"] == 320 and info["height"] == 240 and close(info["duration"], 3.0, 0.15) and info["has_audio"] is True)
check("probe spots a silent clip", lambda: main.probe(silent)["has_audio"] is False)

cut_file = tmp / "cut.mp4"
main.cut(three, cut_file, 1, 1)
check("cut has the right length", lambda: close(main.probe(cut_file)["duration"], 1.0, 0.2))
# testsrc shows a running counter, so a clip that starts 1s in must look different from the very start
check("cut starts in the right place", lambda: first_frame_bytes(cut_file) != first_frame_bytes(three) and close(main.probe(cut_file)["duration"], 1.0, 0.2))
check("cut keeps the audio", lambda: main.probe(cut_file)["has_audio"])

work = tmp / "join folder"
work.mkdir()
joined = work / "joined clips.mp4"
main.join([three, two], joined)
check("join adds the lengths", lambda: close(main.probe(joined)["duration"], 5.0, 0.3) and main.probe(joined)["width"] == 320 and main.probe(joined)["has_audio"])
check("join copes with spaces and cleans up", lambda: [p.name for p in work.iterdir()] == ["joined clips.mp4"])

small = tmp / "small.mp4"
main.resize(three, small, 160)
small_info = main.probe(small)
check("resize keeps the shape", lambda: small_info["width"] == 160 and small_info["height"] == 120)
odd = tmp / "odd.mp4"
main.resize(three, odd, 100)  # 240 * 100 / 320 = 75, which a video can't be
odd_info = main.probe(odd)
check("resize keeps audio and an even height", lambda: odd_info["width"] == 100 and odd_info["height"] % 2 == 0 and odd_info["has_audio"] and small_info["has_audio"])
