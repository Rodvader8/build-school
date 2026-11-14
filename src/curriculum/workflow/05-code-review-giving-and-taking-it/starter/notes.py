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


def proc(c, t, a):
    """Find notes whose title contains t."""
    sql = "SELECT id, title FROM notes WHERE title LIKE '%" + t + "%'"
    if not a:
        sql += " AND archived = 0"
    return [{"id": r[0], "title": r[1]} for r in c.execute(sql)]


def notes_with_tags(conn):
    out = []
    for note_id, title in conn.execute("SELECT id, title FROM notes WHERE archived = 0 ORDER BY id").fetchall():
        tags = [r[0] for r in conn.execute("SELECT tag FROM tags WHERE note_id = ? ORDER BY tag", (note_id,))]
        out.append({"id": note_id, "title": title, "tags": tags})
    return out


def delete_note(conn, note_id):
    conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    return True
