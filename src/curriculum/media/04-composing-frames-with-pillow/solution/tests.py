# tests.py: Check my work runs this file. Read it, but don't change it.
# It finds the text on a card by comparing it with a blank card of the same colour,
# then measures the box the text covers and checks it against the safe zone.
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

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


def text_box(card, bg):
    """(left, top, right, bottom) of everything that isn't the background, or None for a blank card."""
    return ImageChops.difference(card.convert("RGB"), Image.new("RGB", card.size, bg)).getbbox()


def inside(box, safe):
    return box is not None and box[0] >= safe[0] and box[1] >= safe[1] and box[2] <= safe[2] and box[3] <= safe[3]


check("safe_box for 1080x1920", lambda: main.safe_box(1080, 1920) == (65, 250, 1015, 1536))
check("safe_box scales", lambda: main.safe_box(360, 640) == (22, 83, 338, 512))

scratch = ImageDraw.Draw(Image.new("RGB", (10, 10)))
font = main.get_font(40)
sentence = "How a nightly job checks thirteen websites while you sleep"
lines = main.wrap_text(scratch, sentence, font, 400)
check("wrap_text fits and keeps every word", lambda: len(lines) >= 3 and " ".join(lines).split() == sentence.split() and all(scratch.textlength(l, font=font) <= 400 for l in lines))
huge = main.wrap_text(scratch, "see https://example.com/a/very/long/address/that/never/ends/anywhere ok", font, 300)
check("wrap_text copes with a huge word", lambda: " ".join(huge).split() == "see https://example.com/a/very/long/address/that/never/ends/anywhere ok".split() and any(l.startswith("https") and " " not in l for l in huge))

BG = (15, 15, 30)
short = main.title_card("Cron jobs")
check("title_card size and colour", lambda: short.mode == "RGB" and short.size == (1080, 1920) and short.getpixel((0, 0)) == BG and main.title_card("Hi", size=(360, 640), bg=(200, 30, 30)).getpixel((5, 5)) == (200, 30, 30) and text_box(short, BG) is not None)

safe = main.safe_box(1080, 1920)
box = text_box(short, BG)
check("short title is safe and centred", lambda: inside(box, safe) and abs((box[0] + box[2]) / 2 - 540) <= 6 and abs((box[1] + box[3]) / 2 - (safe[1] + safe[3]) / 2) <= 45)

long_card = main.title_card(sentence)
long_box = text_box(long_card, BG)
check("long title wraps inside the safe area", lambda: inside(long_box, safe) and (long_box[3] - long_box[1]) > (box[3] - box[1]) * 2)

tmp = Path(tempfile.mkdtemp())
card = tmp / "card.png"
main.title_card("Cron jobs", size=(360, 640)).save(card)
clip = tmp / "card.mp4"
main.card_to_clip(card, clip, seconds=2)
info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(clip)], capture_output=True, text=True).stdout)
video = info["streams"][0]
check("card_to_clip makes a clip", lambda: abs(float(info["format"]["duration"]) - 2.0) < 0.15 and (video["width"], video["height"]) == (360, 640) and video["pix_fmt"] == "yuv420p" and len(info["streams"]) == 1)
