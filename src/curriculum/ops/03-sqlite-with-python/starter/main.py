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
    pass


def add_check(conn, url, status, ms, checked_at):
    """Save one check. Use ? placeholders, and commit."""
    pass


def latest_status(conn, url):
    """The status of the newest check for this URL (by checked_at), or None if there isn't one."""
    pass


def slowest(conn, limit=3):
    """The slowest checks as (url, ms) tuples, slowest first. Skip checks with no timing."""
    pass


def uptime_percent(conn, url):
    """Percent of this URL's checks with a 2xx or 3xx status, rounded to 1 decimal. None if no checks."""
    pass
