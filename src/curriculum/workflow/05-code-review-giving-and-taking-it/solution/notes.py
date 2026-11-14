"""A tiny notes store on SQLite."""
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS tags (note_id INTEGER NOT NULL, tag TEXT NOT NULL);
"""


def connect(path=":memory:"):
    conn = sqlite3.connect(path)
    conn.executescript(SCHEMA)
    return conn


def add_note(conn, title, body, tags=()):
    cur = conn.execute("INSERT INTO notes (title, body) VALUES (?, ?)", (title, body))
    for tag in tags:
        conn.execute("INSERT INTO tags (note_id, tag) VALUES (?, ?)", (cur.lastrowid, tag))
    conn.commit()
    return cur.lastrowid


def search_notes(conn, term, include_archived=False):
    """Find notes whose title contains the term."""
    sql = "SELECT id, title FROM notes WHERE title LIKE ?"
    if not include_archived:
        sql += " AND archived = 0"
    return [{"id": row[0], "title": row[1]} for row in conn.execute(sql, ("%" + term + "%",))]


def notes_with_tags(conn):
    rows = conn.execute(
        "SELECT n.id, n.title, t.tag FROM notes n LEFT JOIN tags t ON t.note_id = n.id "
        "WHERE n.archived = 0 ORDER BY n.id, t.tag"
    )
    by_id = {}
    for note_id, title, tag in rows:
        note = by_id.setdefault(note_id, {"id": note_id, "title": title, "tags": []})
        if tag is not None:
            note["tags"].append(tag)
    return list(by_id.values())


def delete_note(conn, note_id):
    """Delete a note. Returns True if it existed, False if there was nothing to delete."""
    deleted = conn.execute("DELETE FROM notes WHERE id = ?", (note_id,)).rowcount
    conn.commit()
    return deleted > 0
