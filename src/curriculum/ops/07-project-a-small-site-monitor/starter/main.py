import sqlite3
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

SCHEMA = """
CREATE TABLE IF NOT EXISTS checks (
    id         INTEGER PRIMARY KEY,
    url        TEXT NOT NULL,
    bucket     TEXT NOT NULL,   -- the hour this check belongs to, e.g. 2026-01-01T10
    status     INTEGER,         -- NULL when nothing answered
    ms         REAL,            -- NULL when nothing answered
    checked_at TEXT NOT NULL,
    UNIQUE (url, bucket)        -- one row per site per hour: this is what makes a re-run harmless
);
"""

UNKNOWN = object()  # "we've never checked this URL before"


def connect(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def bucket_for(now):
    return now.strftime("%Y-%m-%dT%H")


def is_up(status):
    return status is not None and 200 <= status < 400


def describe_change(url, old, new):
    """The alert text for a change in status, or None if there's nothing to say (from lesson 6)."""
    if is_up(old) and not is_up(new):
        return f"DOWN: {url} ({new if new is not None else 'no response'})"
    if not is_up(old) and is_up(new):
        return f"UP again: {url}"
    return None


def check_url(url, timeout=5):
    """Request the URL. Return (status, ms): the HTTP status, and how long it took in milliseconds
    (rounded to 1 decimal). If nothing answers (refused, timed out, bad name), return (None, None).
    A 404 or 500 is still an answer: return it, don't raise."""
    # TODO
    return (0, 0)


def record(conn, url, bucket, status, ms, checked_at):
    """Insert the check. Return True if it was stored, False if this URL already has a row for this bucket."""
    # TODO
    return True


def previous_status(conn, url, bucket):
    """The status of this URL's newest row from an EARLIER bucket, or UNKNOWN if there isn't one."""
    # TODO
    return UNKNOWN


def run_once(urls, conn, now, notify):
    """Check every URL once. For each row actually stored, call notify(message) if describe_change says so.
    Return [{"url", "status", "ms"}, ...] for the rows stored in this run."""
    # TODO
    return []


def latest(conn):
    """The newest row for each URL, sorted by URL: [{"url", "status", "ms", "checked_at"}, ...]."""
    # TODO
    return []


if __name__ == "__main__":
    folder = Path(__file__).parent
    urls = [l.strip() for l in (folder / "urls.txt").read_text().splitlines() if l.strip() and not l.startswith("#")]
    conn = connect(str(folder / "monitor.db"))
    for result in run_once(urls, conn, datetime.now(), lambda message: print("ALERT:", message)):
        print(result)
    sys.exit(0)
