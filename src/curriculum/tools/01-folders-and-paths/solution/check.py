# check.py: Check my work runs this file. Read it, but don't change it.
from pathlib import Path

here = Path.cwd().resolve()
projects = here / "projects"


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


answers = {}
for line in Path("paths.txt").read_text().splitlines():
    if line.strip().startswith("#") or ":" not in line:
        continue
    key, _, value = line.partition(":")
    answers[key.strip()] = value.strip().strip("\"'")


def reaches(key, start, target):
    """True when the answer is a relative path that, followed from `start`, lands on `target`."""
    answer = answers.get(key, "")
    if not answer or answer.startswith(("/", "~")):
        return False
    return (start / answer).resolve() == target.resolve()


check("A: logo.svg from site-monitor", lambda: reaches("A", projects / "site-monitor", projects / "shared/logo.svg") and ".." in answers["A"])
check("B: summary.md from traffic-reporter", lambda: reaches("B", projects / "traffic-reporter", projects / "site-monitor/reports/2026-11/summary.md") and ".." in answers["B"])
check("C: settings.json from the 2026-11 folder", lambda: reaches("C", projects / "site-monitor/reports/2026-11", projects / "site-monitor/config/settings.json") and answers["C"].count("..") >= 2)
check("D: the absolute path of monitor.py", lambda: answers.get("D", "").startswith("/") and Path(answers["D"]).resolve() == (projects / "site-monitor/monitor.py").resolve())
