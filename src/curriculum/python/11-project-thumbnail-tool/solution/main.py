# Project: a thumbnail tool.
# Usage: python3 main.py photos --out thumbs --width 400
import argparse
import logging
import sys
from pathlib import Path

from PIL import Image

log = logging.getLogger("thumbs")
GAP = 16


def make_thumbnail(source, destination, width):
    with Image.open(source) as image:
        height = round(image.height * width / image.width)
        small = image.convert("RGB").resize((width, height), Image.LANCZOS)
        small.save(destination, "WEBP", quality=80)
        return small


def contact_sheet(images, destination):
    width = sum(i.width for i in images) + GAP * (len(images) + 1)
    height = max(i.height for i in images) + GAP * 2
    sheet = Image.new("RGB", (width, height), (15, 17, 21))
    x = GAP
    for image in images:
        sheet.paste(image, (x, GAP))
        x += image.width + GAP
    sheet.save(destination, "JPEG", quality=85)
    return sheet


def main():
    parser = argparse.ArgumentParser(description="Make WebP thumbnails and a contact sheet from a folder of JPEGs.")
    parser.add_argument("folder", type=Path, help="folder of .jpg photos")
    parser.add_argument("--out", type=Path, default=Path("thumbs"), help="where to save (default: thumbs)")
    parser.add_argument("--width", type=int, default=400, help="thumbnail width in px (default 400)")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    if not args.folder.is_dir():
        log.error("No such folder: %s", args.folder)
        sys.exit(1)

    photos = sorted(args.folder.glob("*.jpg"))
    args.out.mkdir(parents=True, exist_ok=True)
    smalls = []
    for photo in photos:
        try:
            smalls.append(make_thumbnail(photo, args.out / f"{photo.stem}.webp", args.width))
        except OSError as error:
            log.warning("Skipped %s: %s", photo.name, error)

    if smalls:
        sheet = contact_sheet(smalls, args.out / "contact-sheet.jpg")
        print(f"{len(smalls)} thumbnails, contact sheet {sheet.width}x{sheet.height}")
    else:
        print("No photos found.")


if __name__ == "__main__":
    main()
