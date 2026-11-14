# tests.py: Check my work runs this file. Read it, but don't change it.
# It works in a temporary folder, and breaks os.replace on purpose to test a failed save.
import os
import tempfile
from pathlib import Path

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


def raises(function, kind, mention=""):
    try:
        function()
    except kind as error:
        return mention in str(error)
    return False


tmp = Path(tempfile.mkdtemp())
state_file = tmp / "state.json"

check("load_state starts empty", lambda: main.load_state(state_file) == {"done": []})

bad = tmp / "broken.json"
bad.write_text('{"done": ["a", ')
check("corrupt state is not hidden", lambda: raises(lambda: main.load_state(bad), ValueError, "broken.json"))

main.save_state(state_file, {"done": ["a"], "runs": 1})
check("state round-trips", lambda: main.load_state(state_file) == {"done": ["a"], "runs": 1})
check("no temp files left", lambda: sorted(p.name for p in tmp.iterdir()) == ["broken.json", "state.json"])


def failing_replace(*args, **kwargs):
    raise RuntimeError("disk went away")


real_replace = os.replace
os.replace = failing_replace
try:
    try:
        main.save_state(state_file, {"done": ["a", "b", "c"], "runs": 2})
    except RuntimeError:
        pass
finally:
    os.replace = real_replace
check("a failed save keeps the old file", lambda: main.load_state(state_file) == {"done": ["a"], "runs": 1} and sorted(p.name for p in tmp.iterdir()) == ["broken.json", "state.json"])

jobs_state = tmp / "jobs.json"
items = [{"id": "a"}, {"id": "b"}, {"id": "c"}]
seen = []

first = main.process_new(items, lambda item: seen.append(item["id"]), jobs_state)
check("process_new handles new items", lambda: first == ["a", "b", "c"] and seen == ["a", "b", "c"])

second = main.process_new(items, lambda item: seen.append(item["id"]), jobs_state)
check("second run does nothing", lambda: second == [] and seen == ["a", "b", "c"])

third = main.process_new(items + [{"id": "d"}], lambda item: seen.append(item["id"]), jobs_state)
check("only new items are handled", lambda: third == ["d"] and seen == ["a", "b", "c", "d"])

crash_state = tmp / "crash.json"


def flaky(item):
    if item["id"] == "b":
        raise RuntimeError("boom")


crashed = raises(lambda: main.process_new(items, flaky, crash_state), RuntimeError, "boom")
kept = main.load_state(crash_state)["done"] if crash_state.exists() else None
retried = []
after = main.process_new(items, lambda item: retried.append(item["id"]), crash_state)
check("a crash resumes cleanly", lambda: crashed and kept == ["a"] and after == ["b", "c"] and retried == ["b", "c"])
