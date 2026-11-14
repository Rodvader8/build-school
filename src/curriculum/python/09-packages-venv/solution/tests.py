# tests.py: Check my work runs this file. Read it, but don't change it.
import subprocess
import sys
from pathlib import Path


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


here = Path.cwd().resolve()
check("in a venv", lambda: sys.prefix != sys.base_prefix)
check("the venv is this lesson's .venv", lambda: Path(sys.prefix).resolve() == here / ".venv")
check("humanize installed", lambda: __import__("humanize") is not None)
check("requirements.txt pins it", lambda: any(line.strip().startswith("humanize==") for line in Path("requirements.txt").read_text().splitlines()))
output = subprocess.run([sys.executable, "main.py"], capture_output=True, text=True).stdout
check("main.py uses it", lambda: "1,284,000" in output and "1.5 MB" in output)
