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
    pass


def write_srt(cues, path):
    """cues is a list of (start_seconds, end_seconds, text). Write an SRT file (UTF-8), numbered from 1."""
    pass


def burn_captions(video, srt, out, font_size=24, margin=40):
    """Paint the captions from the SRT file onto the video, bottom centre, and keep the audio.
    Tip: run ffmpeg with cwd set to the SRT's folder, so the filter only needs the file name."""
    pass
