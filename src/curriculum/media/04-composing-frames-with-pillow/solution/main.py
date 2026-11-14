import subprocess

from PIL import Image, ImageDraw, ImageFont

SIZE = (1080, 1920)  # a 9:16 frame: width, height

# The safe zone, as fractions of the frame (keep text out of the margins).
SAFE_SIDE = 0.06
SAFE_TOP = 0.13
SAFE_BOTTOM = 0.20


def run(command):
    done = subprocess.run(command, capture_output=True, text=True)
    if done.returncode != 0:
        raise RuntimeError(f"{command[0]} failed: {done.stderr.strip()[-400:]}")


def get_font(size):
    """A built-in font at this pixel size. (Swap in ImageFont.truetype for a brand font.)"""
    return ImageFont.load_default(size)


def safe_box(width, height):
    """The safe area as (left, top, right, bottom) in whole pixels, using the SAFE_ fractions."""
    left = round(width * SAFE_SIDE)
    top = round(height * SAFE_TOP)
    return (left, top, width - left, height - round(height * SAFE_BOTTOM))


def wrap_text(draw, text, font, max_width):
    """Split the text into lines no wider than max_width pixels (measure with draw.textlength).
    Never lose a word. A single word that's too wide gets a line to itself."""
    lines = []
    line = ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if line and draw.textlength(candidate, font=font) > max_width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def title_card(text, size=SIZE, bg=(15, 15, 30), fg=(255, 255, 255)):
    """An RGB image of this size with the text centred (wrapped) inside the safe box.
    Use a font about a tenth of the frame's width tall: get_font(size[0] // 10)."""
    width, height = size
    image = Image.new("RGB", size, bg)
    draw = ImageDraw.Draw(image)
    font = get_font(width // 10)
    left, top, right, bottom = safe_box(width, height)
    lines = wrap_text(draw, text, font, right - left)
    line_height = round(font.size * 1.3)
    y = top + ((bottom - top) - line_height * len(lines)) // 2
    for line in lines:
        x = (width - draw.textlength(line, font=font)) / 2
        draw.text((x, y), line, font=font, fill=fg)
        y += line_height
    return image


def card_to_clip(png, out, seconds=2):
    """Turn one image into a silent video of this many seconds (25 fps, yuv420p)."""
    run(["ffmpeg", "-y", "-framerate", "25", "-loop", "1", "-i", str(png), "-t", str(seconds),
         "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", str(out)])
