Time to build a real tool, the kind you'll actually use. It's a smaller cousin of the scripts that generate thumbnails for real image galleries.

## The brief

`main.py` is a command-line tool:

```bash
python3 main.py photos --out thumbs --width 400
```

It should:

1. Take a **folder** of `.jpg` photos (positional), an `--out` folder (default `thumbs`) and a `--width` (default 400).
2. Save a **WebP thumbnail** of each photo into `--out`, named after the photo (`headland.jpg` becomes `headland.webp`), at `--width` wide, keeping its shape.
3. Save a **contact sheet**, `contact-sheet.jpg`: all the thumbnails side by side on a dark background, with a little gap around each.
4. Print a summary like **3 thumbnails, contact sheet 1024x548**.
5. Handle problems like a pro: `--help` explains it, and a folder that doesn't exist prints a clear error and exits with code 1. No traceback.

## Building a contact sheet

```python
sheet = Image.new("RGB", (width, height), (15, 17, 21))   # a blank dark canvas
sheet.paste(thumbnail, (x, y))                             # stick an image onto it
```

Work out the canvas size from the thumbnails: the total of their widths plus the gaps, by the tallest height plus the gaps.

## Tools you'll want

- `Path("photos").glob("*.jpg")` finds the photos. Wrap it in `sorted()` so the order is predictable.
- `photo.stem` is the file name without its extension.
- `sys.exit(1)` stops with an error code. Scripts and cron jobs use exit codes to know something failed.

Everything here is from earlier lessons. Read `tests.py` first: it shows exactly how your tool will be run.
