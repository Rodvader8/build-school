# tests.py: Check my work runs this file. Read it to see exactly what is tested,
# but don't change it.
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

from pathlib import Path
from PIL import Image

out = Path("out")
out.mkdir(exist_ok=True)
for f in out.iterdir():
    f.unlink()

main.make_thumbnail(Path("photos/headland.jpg"), out / "headland-thumb.webp", 400)
main.make_thumbnail(Path("photos/cellar.jpg"), out / "cellar-thumb.webp", 400)
land = Image.open(out / "headland-thumb.webp")
tall = Image.open(out / "cellar-thumb.webp")
check("thumbnail is 400 wide", lambda: land.width == 400 and tall.width == 400)
check("thumbnail keeps its shape", lambda: abs(land.height - round(400 * 792 / 1400)) <= 1 and abs(tall.height - 500) <= 1)
check("thumbnail is WebP", lambda: land.format == "WEBP")

main.make_og(Path("photos/cellar.jpg"), out / "cellar-og.jpg")
og = Image.open(out / "cellar-og.jpg")
check("share image is 1200x630", lambda: og.size == (1200, 630))
check("share image is JPEG, never WebP", lambda: og.format == "JPEG")
check("share image is cropped, not squashed", lambda: "ImageOps.fit" in open("main.py").read() or "crop" in open("main.py").read())
