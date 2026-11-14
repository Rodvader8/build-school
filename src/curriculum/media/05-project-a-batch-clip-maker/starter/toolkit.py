"""The pieces from lessons 1 to 4, put together. Read it, but you don't need to change it.

render_clip() is the one you'll call: it cuts a slice out of a long video, burns the captions in,
and puts a title card in front, all in a single ffmpeg run.
"""
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SIZE = (360, 640)  # small 9:16 frames keep batches quick. Use (1080, 1920) for the real thing.


def run(command, cwd=None):
    done = subprocess.run(command, capture_output=True, text=True, cwd=cwd)
    if done.returncode != 0:
        raise RuntimeError(f"{command[0]} failed: {done.stderr.strip()[-300:]}")


def slugify(text):
    """'Cron jobs, explained!' -> 'cron-jobs-explained'"""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "clip"


def format_time(seconds):
    ms = round(seconds * 1000)
    hours, ms = divmod(ms, 3_600_000)
    minutes, ms = divmod(ms, 60_000)
    secs, ms = divmod(ms, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{ms:03}"


def parse_time(text):
    clock, ms = text.strip().split(",")
    hours, minutes, secs = (int(part) for part in clock.split(":"))
    return hours * 3600 + minutes * 60 + secs + int(ms) / 1000


def parse_srt(text):
    cues = []
    for block in text.replace("\r\n", "\n").strip().split("\n\n"):
        lines = block.strip().split("\n")
        if len(lines) >= 3:
            start, end = (parse_time(part) for part in lines[1].split(" --> "))
            cues.append((start, end, "\n".join(lines[2:])))
    return cues


def write_srt(cues, path):
    blocks = [f"{n}\n{format_time(a)} --> {format_time(b)}\n{text}\n" for n, (a, b, text) in enumerate(cues, start=1)]
    Path(path).write_text("\n".join(blocks), encoding="utf-8")


def cues_for_clip(cues, start, end):
    length = end - start
    return [(round(max(a - start, 0), 3), round(min(b - start, length), 3), text) for a, b, text in cues if b > start and a < end]


def title_card(text, size=SIZE, bg=(15, 15, 30), fg=(255, 255, 255)):
    """Centred, wrapped text inside the safe zone of a 9:16 frame."""
    width, height = size
    image = Image.new("RGB", size, bg)
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(width // 10)
    left, top = round(width * 0.06), round(height * 0.13)
    right, bottom = width - left, height - round(height * 0.20)
    lines, line = [], ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if line and draw.textlength(candidate, font=font) > right - left:
            lines.append(line)
            line = word
        else:
            line = candidate
    lines.append(line)
    line_height = round(font.size * 1.3)
    y = top + ((bottom - top) - line_height * len(lines)) // 2
    for line in lines:
        draw.text(((width - draw.textlength(line, font=font)) / 2, y), line, font=font, fill=fg)
        y += line_height
    return image


def render_clip(source, start, end, title, cues, out, size=SIZE, card_seconds=1.0):
    """Cut source from start to end seconds, burn in `cues` (timed for the WHOLE source), and put a
    title card in front. Writes `out` (an mp4 with sound)."""
    width, height = size
    with tempfile.TemporaryDirectory() as tmp:
        title_card(title, size).save(Path(tmp) / "card.png")
        picture = f"[1:v]scale={width}:{height},setsar=1,fps=25,format=yuv420p"
        clip_cues = cues_for_clip(cues, start, end)
        if clip_cues:
            write_srt(clip_cues, Path(tmp) / "captions.srt")
            picture += ",subtitles=captions.srt:force_style='FontSize=18,Alignment=2,MarginV=40'"
        graph = (
            f"[0:v]scale={width}:{height},setsar=1,fps=25,format=yuv420p[card];"
            f"{picture}[main];"
            "[1:a]aresample=44100,aformat=channel_layouts=stereo[sound];"
            "[card][2:a][main][sound]concat=n=2:v=1:a=1[v][a]"
        )
        run([
            "ffmpeg", "-y",
            "-framerate", "25", "-loop", "1", "-t", str(card_seconds), "-i", "card.png",
            "-ss", str(start), "-t", str(end - start), "-i", str(Path(source).resolve()),
            "-f", "lavfi", "-t", str(card_seconds), "-i", "anullsrc=r=44100:cl=stereo",
            "-filter_complex", graph, "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", str(Path(out).resolve()),
        ], cwd=tmp)
