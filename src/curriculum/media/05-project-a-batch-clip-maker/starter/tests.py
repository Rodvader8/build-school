# tests.py: Check my work runs this file. Read it, but don't change it.
# It makes a short test video in a temporary folder, runs your batch on it (with a fake clip maker
# for the failure tests, and the real one for the real clips), then runs your command line.
import json
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import clipmaker
except Exception as error:
    print("Could not load clipmaker.py:", repr(error))
    raise SystemExit(1)


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def raises(function, mention):
    try:
        function()
    except ValueError as error:
        return all(part in str(error) for part in mention)
    return False


def probe(path):
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)], capture_output=True, text=True).stdout)
    video = next(s for s in info["streams"] if s["codec_type"] == "video")
    return video["width"], video["height"], float(info["format"]["duration"]), any(s["codec_type"] == "audio" for s in info["streams"])


tmp = Path(tempfile.mkdtemp())
source = tmp / "talk.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "testsrc=size=360x640:rate=25:duration=6", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=44100:duration=6",
                "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "aac", str(source)], check=True)
captions = tmp / "talk.srt"
captions.write_text("1\n00:00:00,500 --> 00:00:02,500\nHello there\n\n2\n00:00:03,000 --> 00:00:05,000\nSecond caption\n", encoding="utf-8")

JOBS = [
    {"title": "Cron jobs, explained", "start": 0.5, "end": 2.5},
    {"title": "Nightly digest", "start": 3, "end": 5},
]

check("progress_bar draws the bar", lambda: (clipmaker.progress_bar(1, 4, 8), clipmaker.progress_bar(4, 4, 8), clipmaker.progress_bar(0, 4, 8), clipmaker.progress_bar(1, 3, 10))
      == ("[##------]  25%", "[########] 100%", "[--------]   0%", "[###-------]  33%"))

good = tmp / "jobs.json"
good.write_text(json.dumps(JOBS))
check("load_jobs reads good jobs", lambda: clipmaker.load_jobs(good) == JOBS)


def bad(content):
    path = tmp / "bad.json"
    path.write_text(json.dumps(content) if not isinstance(content, str) else content)
    return lambda: clipmaker.load_jobs(path)


check("load_jobs explains bad jobs", lambda: (
    raises(bad([JOBS[0], {"title": "  ", "start": 1, "end": 2}]), ["job 2", "title"])
    and raises(bad([{"title": "A", "start": 5, "end": 5}]), ["job 1", "end"])
    and raises(bad([{"title": "A", "start": "1", "end": 2}]), ["job 1", "start"])
    and raises(bad([JOBS[0], JOBS[1], {"title": "C", "start": 1}]), ["job 3", "end"])
    and raises(bad({"title": "not a list"}), ["list"])
    and raises(bad("{ nope"), ["JSON"])
))

# The batch logic, with a fake clip maker so nothing waits for ffmpeg.
made_calls = []


def fake_maker(src, job, out_path, cues):
    made_calls.append(job["title"])
    Path(out_path).write_bytes(b"fake")


three = JOBS + [{"title": "Third one!", "start": 1, "end": 2}]
progress = []
first = clipmaker.run_batch(source, three, tmp / "fake", maker=fake_maker, on_progress=lambda *a: progress.append(a))
names = ["01-cron-jobs-explained.mp4", "02-nightly-digest.mp4", "03-third-one.mp4"]
check("run_batch makes every clip", lambda: first == {"made": names, "skipped": [], "failed": []} and sorted(p.name for p in (tmp / "fake").iterdir()) == names)

again = clipmaker.run_batch(source, three, tmp / "fake", maker=fake_maker)
forced = clipmaker.run_batch(source, three, tmp / "fake", maker=fake_maker, force=True)
check("run_batch skips finished clips", lambda: again == {"made": [], "skipped": names, "failed": []} and len(made_calls) == 6 and forced["made"] == names)


def flaky_maker(src, job, out_path, cues):
    if job["title"] == "Nightly digest":
        Path(out_path).write_bytes(b"half a fi")
        raise RuntimeError("ffmpeg fell over")
    Path(out_path).write_bytes(b"fake")


steps = []
rough = clipmaker.run_batch(source, three, tmp / "rough", maker=flaky_maker, on_progress=lambda *a: steps.append(a))
check("one failure does not stop the batch", lambda: rough["made"] == [names[0], names[2]] and len(rough["failed"]) == 1 and rough["failed"][0][0] == names[1] and "ffmpeg fell over" in rough["failed"][0][1] and not (tmp / "rough" / names[1]).exists())
check("progress is reported for every job", lambda: progress == [(1, 3, names[0]), (2, 3, names[1]), (3, 3, names[2])] and steps == progress)

# The real thing: a title card (1 second) in front of each 2 second cut, with the captions burned in.
real = clipmaker.run_batch(source, JOBS, tmp / "real", cues=[(0.5, 2.5, "Hello there"), (3, 5, "Second caption")])
clips = [tmp / "real" / n for n in names[:2]]
check("real clips come out right", lambda: len(real["made"]) == 2 and not real["failed"] and all(probe(c)[:2] == (360, 640) and abs(probe(c)[2] - 3.0) < 0.35 and probe(c)[3] for c in clips))

# The command line, as a person would run it.
script = Path("clipmaker.py").resolve()
command = [sys.executable, str(script), str(source), "--jobs", str(good), "--captions", str(captions), "--out", str(tmp / "cli")]
one = subprocess.run(command, capture_output=True, text=True, cwd=script.parent, timeout=300)
check("cli runs end to end", lambda: one.returncode == 0 and "100%" in one.stdout and "2 made, 0 skipped, 0 failed" in one.stdout and sorted(p.name for p in (tmp / "cli").iterdir()) == names[:2])
two = subprocess.run(command, capture_output=True, text=True, cwd=script.parent, timeout=300)
check("cli skips on a second run", lambda: two.returncode == 0 and "0 made, 2 skipped, 0 failed" in two.stdout)
oops = subprocess.run([sys.executable, str(script), str(source), "--jobs", str(tmp / "bad.json"), "--out", str(tmp / "nope")], capture_output=True, text=True, cwd=script.parent, timeout=60)
check("cli reports a bad jobs file kindly", lambda: oops.returncode == 2 and oops.stderr.strip() != "" and "Traceback" not in oops.stderr)
