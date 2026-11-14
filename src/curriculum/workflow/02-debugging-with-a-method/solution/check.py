# check.py: Check my work runs this file. Read it, but don't change it.
import importlib.util
import re
import subprocess
import sys
from pathlib import Path

here = Path.cwd()


def load(filename, name):
    spec = importlib.util.spec_from_file_location(name, here / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def entries(report, lines):
    return [report.parse_line(line) for line in lines]


bugged = load("bugged.py", "bugged")
fixed = load("report.py", "report_fixed")
mine = load("my_tests.py", "my_tests")


def fails_with_assertion(test, module):
    try:
        test(module)
    except AssertionError:
        return True
    except Exception:
        return False
    return False


def passes(test, module):
    try:
        test(module)
    except Exception:
        return False
    return True


def catches_bug(test_name):
    test = getattr(mine, test_name)
    return fails_with_assertion(test, bugged) and passes(test, fixed)


# Behaviour of the fixed code, written independently of your tests.
def top_paths_ok():
    data = entries(fixed, ["2026-03-02 GET /a 200 1", "2026-03-02 GET /a 200 1", "2026-03-02 GET /b 200 1", "2026-03-02 GET /c 200 1"])
    return [p for p, _ in fixed.top_paths(data, 3)] == ["/a", "/b", "/c"] and len(fixed.top_paths(data, 1)) == 1 and len(fixed.top_paths(data, 9)) == 3


def slowest_ok():
    data = entries(fixed, ["2026-03-02 GET /x 200 95", "2026-03-02 GET /y 200 1200", "2026-03-02 GET /z 200 880"])
    return fixed.slowest(data)["path"] == "/y" and data[0]["ms"] == 95


def error_paths_ok():
    one = entries(fixed, ["2026-03-02 GET /one 500 5"])
    two = entries(fixed, ["2026-03-03 GET /two 503 5", "2026-03-03 GET /two 500 5"])
    return fixed.error_paths(one) == ["/one"] and fixed.error_paths(two) == ["/two"] and fixed.error_paths(one, ["/x"]) == ["/x", "/one"]


check("bug 1: top_paths(entries, 3) returns three pages", top_paths_ok)
check("bug 2: slowest() compares numbers, not text", slowest_ok)
check("bug 3: error_paths() no longer remembers earlier calls", error_paths_ok)
check("your test_top_paths fails on the buggy code and passes on the fix", lambda: catches_bug("test_top_paths"))
check("your test_slowest fails on the buggy code and passes on the fix", lambda: catches_bug("test_slowest"))
check("your test_error_paths fails on the buggy code and passes on the fix", lambda: catches_bug("test_error_paths"))

existing = subprocess.run([sys.executable, "-m", "unittest", "tests"], cwd=here, capture_output=True, text=True)
check("the team's existing tests still pass", lambda: existing.returncode == 0)


def log_filled():
    text = (here / "DEBUG_LOG.md").read_text()
    lines = re.findall(r"^(?:Reproduce|Isolate|Hypothesis|Fix|Proof):[ \t]*(.+)$", text, re.M)
    return len([line for line in lines if len(line.split()) >= 4]) >= 15


check("DEBUG_LOG.md has all five steps for all three bugs", log_filled)
