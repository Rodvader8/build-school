# Lesson 10: images with Pillow.
from pathlib import Path

from PIL import Image, ImageOps


def make_thumbnail(source, destination, width):
    """Save a copy of source, `width` pixels wide, same shape, as WebP."""


def make_og(source, destination):
    """Save a 1200x630 share image (Open Graph), cropped to fill, as JPEG."""


if __name__ == "__main__":
    image = Image.open("photos/headland.jpg")
    print(image.size, image.format)
