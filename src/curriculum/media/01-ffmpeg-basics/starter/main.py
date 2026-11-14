import json
import subprocess
import tempfile
from pathlib import Path


def run(command):
    """Run a command given as a list. Raises a readable error if it fails. Returns the finished process."""
    done = subprocess.run(command, capture_output=True, text=True)
    if done.returncode != 0:
        raise RuntimeError(f"{command[0]} failed: {done.stderr.strip()[-400:]}")
    return done


def probe(path):
    """Ask ffprobe about a file. Return {"width": int, "height": int, "duration": float (seconds), "has_audio": bool}."""
    pass


def cut(src, dst, start, duration):
    """Save `duration` seconds of src, starting at `start` seconds, as dst. Keep the audio."""
    pass


def join(clips, dst):
    """Join the clips (a list of paths) end to end into dst. Use a concat list file in a temporary folder."""
    pass


def resize(src, dst, width):
    """Scale the video to this width, keeping its shape (the height must come out even). Keep the audio."""
    pass
