# check.py: Check my work runs this file. Read it, but don't change it.
from pathlib import Path


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


inbox = Path("inbox")
reports = Path("archive/2026/reports")
names = lambda folder: sorted(p.name for p in folder.iterdir()) if folder.is_dir() else []

check("archive/2026/reports exists", lambda: reports.is_dir())
check("the reports were copied, not moved", lambda: names(reports) == ["report-nov.csv", "report-oct.csv"] and (inbox / "report-oct.csv").exists() and (inbox / "report-nov.csv").exists())
check("the copied reports kept their contents", lambda: "2026-11-01,150" in (reports / "report-nov.csv").read_text())
check("both screenshots were moved into images", lambda: names(Path("images")) == ["shot-1.png", "shot-2.png"] and not list(inbox.glob("shot-*.png")))
check("notes.txt was renamed", lambda: not (inbox / "notes.txt").exists() and (inbox / "meeting-notes.txt").read_text().startswith("Call Sam"))
check("the .tmp files are gone", lambda: not list(inbox.glob("*.tmp")))
check("keep-me.txt is still there", lambda: (inbox / "keep-me.txt").read_text().strip() == "keep this one")
