# tests.py: Check my work runs this file. Read it, but don't change it.
# It uses a throwaway database in a temporary folder, so your real data is never touched.
import sqlite3
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


def tables(conn):
    return {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}


tmp = Path(tempfile.mkdtemp())
db = str(tmp / "monitor.db")
conn = main.connect(db)

check("connect makes the table", lambda: "checks" in tables(conn) and conn.row_factory is sqlite3.Row)
check("connect is safe to call twice", lambda: main.connect(db).execute("SELECT COUNT(*) FROM checks").fetchone()[0] == 0)

# a.example: rows go in out of time order, so "newest" can't just mean "last row added"
for row in [
    ("a.example", 200, 90.0, "2026-01-01T12:00:00"),
    ("a.example", 500, 800.0, "2026-01-01T11:00:00"),
    ("a.example", 503, 120.0, "2026-01-01T10:00:00"),
    ("b.example", 200, 300.0, "2026-01-01T10:00:00"),
    ("b.example", 200, 60.0, "2026-01-01T11:00:00"),
    ("b.example", 404, 40.0, "2026-01-01T12:00:00"),
    ("c.example", None, None, "2026-01-01T10:00:00"),
]:
    try:
        main.add_check(conn, *row)
    except Exception as error:
        print(f"  (add_check raised {error!r})")

other = sqlite3.connect(db)  # a second, separate connection: it only sees committed rows
check("add_check commits", lambda: other.execute("SELECT COUNT(*) FROM checks").fetchone()[0] == 7)

injection = main.connect(str(tmp / "injection.db"))
evil = "x'); DROP TABLE checks;--"
try:
    main.add_check(injection, evil, 200, 1.0, "2026-01-01T10:00:00")
except Exception as error:
    print(f"  (add_check raised {error!r})")
check("add_check uses placeholders", lambda: "checks" in tables(injection) and injection.execute("SELECT url FROM checks").fetchone()[0] == evil)

check("latest_status uses the time", lambda: main.latest_status(conn, "a.example") == 200 and main.latest_status(conn, "b.example") == 404)
check("latest_status is None when unknown", lambda: main.latest_status(conn, "nope.example") is None)
check("slowest returns pairs", lambda: main.slowest(conn, 2) == [("a.example", 800.0), ("b.example", 300.0)])
check("slowest skips missing timings", lambda: len(main.slowest(conn, 10)) == 6 and all(ms is not None for _, ms in main.slowest(conn, 10)))
check("uptime_percent counts correctly", lambda: main.uptime_percent(conn, "a.example") == 33.3 and main.uptime_percent(conn, "b.example") == 66.7)
check("uptime_percent counts a failed connection", lambda: main.uptime_percent(conn, "c.example") == 0.0)
check("uptime_percent is None when unknown", lambda: main.uptime_percent(conn, "nope.example") is None)
