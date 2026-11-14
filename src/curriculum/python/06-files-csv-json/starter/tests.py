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

import json
from pathlib import Path

rows = main.read_bookings(Path("bookings.csv"))
check("read_bookings", lambda: len(rows) == 6 and rows[0]["guest"] == "M. Okafor")
check("numbers are numbers", lambda: rows[0]["nights"] == 3 and rows[0]["rate"] == 520)
summary = main.summarise(rows)
check("summarise", lambda: summary == {"bookings": 6, "nights": 17, "revenue": 9680, "by_room": {"Ocean Room": 2080, "Garden Room": 2280, "Cliff Suite": 5320}})
out = Path("summary.json")
out.unlink(missing_ok=True)
main.main()
check("main writes summary.json", lambda: json.loads(out.read_text())["revenue"] == 9680)
check("uses with open or pathlib", lambda: "with open" in Path("main.py").read_text() or ".read_text" in Path("main.py").read_text() or ".open(" in Path("main.py").read_text())
