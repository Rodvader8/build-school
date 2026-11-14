Every site you build needs images at several sizes: thumbnails for cards, big ones for heroes, and a 1200 by 630 share image for Facebook and LinkedIn. Doing that by hand for twelve sites would take a day. **Pillow** does it in seconds, which is why plenty of sites generate their thumbnails with a Python script.

Pillow is already installed on your laptop, so there's no venv needed this time. The `photos` folder has two sample photos: one wide and one tall.

## Opening and resizing

```python
from PIL import Image

with Image.open("photos/headland.jpg") as image:
    print(image.size)          # (1400, 792): width, height
    small = image.resize((400, 226), Image.LANCZOS)
    small.save("out/headland-thumb.webp", "WEBP", quality=80)
```

`LANCZOS` is the high-quality resizing filter. Keep the shape by working out the height from the width: `height = image.height * width / image.width`.

## Cropping to fit

A share image must be exactly 1200 by 630, whatever shape the photo is. Squashing it looks terrible. `ImageOps.fit` crops from the centre to fill instead, the same thing CSS's `object-fit: cover` does:

```python
from PIL import ImageOps
card = ImageOps.fit(image.convert("RGB"), (1200, 630), Image.LANCZOS)
card.save("out/og.jpg", "JPEG", quality=85)
```

`convert("RGB")` matters because JPEG can't store transparency.

## Which format where

- **WebP or AVIF** for images on your pages: much smaller than JPEG.
- **JPEG or PNG for share images, never WebP.** Some platforms still drop WebP share images and show a blank card. You fixed exactly this on three sites in October.

## Your turn

1. `make_thumbnail(source, destination, width)`: resize to `width`, keeping the shape, and save as WebP.
2. `make_og(source, destination)`: crop to fill 1200 by 630 and save as JPEG.

Press Run, then open the `out` folder in your file manager to see the results.
