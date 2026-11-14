# tests.py: Check my work runs this file. It runs your tool the way you would. Don't change it.
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def run(*args):
    return subprocess.run([sys.executable, "main.py", *args], capture_output=True, text=True)


out = Path("test-out")
shutil.rmtree(out, ignore_errors=True)
result = run("photos", "--out", str(out), "--width", "320")
print(result.stdout.strip())
if result.returncode:
    print(result.stderr.strip())

thumbs = sorted(out.glob("*.webp"))
check("runs without errors", lambda: result.returncode == 0)
check("one thumbnail per photo", lambda: [t.stem for t in thumbs] == ["cellar", "headland", "pool"])
check("thumbnails are 320 wide", lambda: thumbs and all(Image.open(t).width == 320 for t in thumbs))
check("contact sheet exists", lambda: (out / "contact-sheet.jpg").exists())
check("contact sheet holds all three side by side", lambda: Image.open(out / "contact-sheet.jpg").width >= 3 * 320)
check("prints a summary", lambda: "3 thumbnails" in result.stdout)
check("--help works", lambda: run("--help").returncode == 0 and "--width" in run("--help").stdout)
missing = run("no-such-folder", "--out", str(out))
check("a missing folder is a clear error, not a crash", lambda: missing.returncode != 0 and "Traceback" not in missing.stderr)
shutil.rmtree(out, ignore_errors=True)
