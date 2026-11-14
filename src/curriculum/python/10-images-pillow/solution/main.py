# Lesson 10: images with Pillow.
from pathlib import Path

from PIL import Image, ImageOps


def make_thumbnail(source, destination, width):
    """Save a copy of source, `width` pixels wide, same shape, as WebP."""
    with Image.open(source) as image:
        height = round(image.height * width / image.width)
        small = image.resize((width, height), Image.LANCZOS)
        small.save(destination, "WEBP", quality=80)


def make_og(source, destination):
    """Save a 1200x630 share image (Open Graph), cropped to fill, as JPEG."""
    with Image.open(source) as image:
        card = ImageOps.fit(image.convert("RGB"), (1200, 630), Image.LANCZOS)
        card.save(destination, "JPEG", quality=85, optimize=True)


if __name__ == "__main__":
    image = Image.open("photos/headland.jpg")
    print(image.size, image.format)
    Path("out").mkdir(exist_ok=True)
    make_thumbnail(Path("photos/headland.jpg"), Path("out/headland-thumb.webp"), 400)
    make_og(Path("photos/cellar.jpg"), Path("out/cellar-og.jpg"))
    print("Saved to out/")
