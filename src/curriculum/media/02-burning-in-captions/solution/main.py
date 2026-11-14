import subprocess
from pathlib import Path


def run(command, cwd=None):
    """Run a command given as a list. Raises a readable error if it fails."""
    done = subprocess.run(command, capture_output=True, text=True, cwd=cwd)
    if done.returncode != 0:
        raise RuntimeError(f"{command[0]} failed: {done.stderr.strip()[-400:]}")
    return done


def format_time(seconds):
    """Seconds as an SRT time: 1.5 -> "00:00:01,500". Round to whole milliseconds first."""
    ms = round(seconds * 1000)
    hours, ms = divmod(ms, 3_600_000)
    minutes, ms = divmod(ms, 60_000)
    secs, ms = divmod(ms, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{ms:03}"


def write_srt(cues, path):
    """cues is a list of (start_seconds, end_seconds, text). Write an SRT file (UTF-8), numbered from 1."""
    blocks = [
        f"{number}\n{format_time(start)} --> {format_time(end)}\n{text}\n"
        for number, (start, end, text) in enumerate(cues, start=1)
    ]
    Path(path).write_text("\n".join(blocks), encoding="utf-8")


def burn_captions(video, srt, out, font_size=24, margin=40):
    """Paint the captions from the SRT file onto the video, bottom centre, and keep the audio.
    Tip: run ffmpeg with cwd set to the SRT's folder, so the filter only needs the file name."""
    srt = Path(srt).resolve()
    style = f"FontSize={font_size},Alignment=2,MarginV={margin}"
    run(["ffmpeg", "-y", "-i", str(Path(video).resolve()), "-vf", f"subtitles={srt.name}:force_style='{style}'",
         "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "copy", str(Path(out).resolve())],
        cwd=srt.parent)
