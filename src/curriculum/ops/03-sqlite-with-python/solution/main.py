import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS checks (
    id         INTEGER PRIMARY KEY,
    url        TEXT NOT NULL,
    status     INTEGER,          -- NULL when the connection failed
    ms         REAL,             -- NULL when the connection failed
    checked_at TEXT NOT NULL     -- ISO time, e.g. 2026-01-01T10:00:00
);
CREATE INDEX IF NOT EXISTS idx_checks_url_time ON checks (url, checked_at);
"""


def connect(path):
    """Open the database file, rows readable by column name, with the schema in place."""
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def add_check(conn, url, status, ms, checked_at):
    """Save one check. Use ? placeholders, and commit."""
    conn.execute(
        "INSERT INTO checks (url, status, ms, checked_at) VALUES (?, ?, ?, ?)",
        (url, status, ms, checked_at),
    )
    conn.commit()


def latest_status(conn, url):
    """The status of the newest check for this URL (by checked_at), or None if there isn't one."""
    row = conn.execute(
        "SELECT status FROM checks WHERE url = ? ORDER BY checked_at DESC LIMIT 1", (url,)
    ).fetchone()
    return row["status"] if row else None


def slowest(conn, limit=3):
    """The slowest checks as (url, ms) tuples, slowest first. Skip checks with no timing."""
    rows = conn.execute(
        "SELECT url, ms FROM checks WHERE ms IS NOT NULL ORDER BY ms DESC LIMIT ?", (limit,)
    ).fetchall()
    return [(row["url"], row["ms"]) for row in rows]


def uptime_percent(conn, url):
    """Percent of this URL's checks with a 2xx or 3xx status, rounded to 1 decimal. None if no checks."""
    total, up = conn.execute(
        "SELECT COUNT(*), SUM(CASE WHEN status BETWEEN 200 AND 399 THEN 1 ELSE 0 END) FROM checks WHERE url = ?",
        (url,),
    ).fetchone()
    if total == 0:
        return None
    return round(100 * (up or 0) / total, 1)
