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
    done = run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)])
    info = json.loads(done.stdout)
    video = next(s for s in info["streams"] if s["codec_type"] == "video")
    return {
        "width": video["width"],
        "height": video["height"],
        "duration": float(info["format"]["duration"]),
        "has_audio": any(s["codec_type"] == "audio" for s in info["streams"]),
    }


def cut(src, dst, start, duration):
    """Save `duration` seconds of src, starting at `start` seconds, as dst. Keep the audio."""
    run(["ffmpeg", "-y", "-ss", str(start), "-i", str(src), "-t", str(duration),
         "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "aac", str(dst)])


def join(clips, dst):
    """Join the clips (a list of paths) end to end into dst. Use a concat list file in a temporary folder."""
    with tempfile.TemporaryDirectory() as tmp:
        listing = Path(tmp) / "list.txt"
        listing.write_text("".join(f"file '{Path(c).resolve()}'\n" for c in clips))
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(dst)])


def resize(src, dst, width):
    """Scale the video to this width, keeping its shape (the height must come out even). Keep the audio."""
    run(["ffmpeg", "-y", "-i", str(src), "-vf", f"scale={width}:-2",
         "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-c:a", "copy", str(dst)])
