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

import subprocess
import sys


def run(*args):
    result = subprocess.run([sys.executable, "main.py", *args], capture_output=True, text=True)
    return result.returncode, result.stdout.strip(), result.stderr


check("uses argparse", lambda: "argparse" in open("main.py").read())
check("amount only", lambda: run("4400") == (0, "$4,400", ""))
check("--gst", lambda: run("4400", "--gst")[1] == "$4,840")
check("--nights", lambda: run("520", "--nights", "3")[1] == "$1,560")
check("--nights and --gst", lambda: run("520", "--nights", "3", "--gst")[1] == "$1,716")
check("--help", lambda: run("--help")[0] == 0 and "--gst" in run("--help")[1])
check("bad amount is refused", lambda: run("lots")[0] != 0)
