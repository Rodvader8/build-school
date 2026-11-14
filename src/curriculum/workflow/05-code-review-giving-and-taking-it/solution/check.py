# check.py: Check my work runs this file. Read it, but don't change it.
import ast
import inspect
import io
import re
import unittest
from pathlib import Path

import notes
import test_notes

here = Path.cwd()


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def fresh(titles=()):
    conn = notes.connect()
    for title in titles:
        notes.add_note(conn, title, "...")
    return conn


# --- the four review comments, checked against the behaviour of your notes.py ---
check("search_notes exists with the requested signature, and proc is gone", lambda: not hasattr(notes, "proc") and list(inspect.signature(notes.search_notes).parameters) == ["conn", "term", "include_archived"] and inspect.signature(notes.search_notes).parameters["include_archived"].default is False)


def search_works():
    conn = fresh(["Meeting notes", "Shopping", "Old meeting"])
    conn.execute("UPDATE notes SET archived = 1 WHERE title = 'Old meeting'")
    live = [n["title"] for n in notes.search_notes(conn, "meet")]
    both = [n["title"] for n in notes.search_notes(conn, "meet", include_archived=True)]
    return live == ["Meeting notes"] and sorted(both) == ["Meeting notes", "Old meeting"]


def search_is_safe():
    conn = fresh(["O'Brien call", "Other"])
    return [n["title"] for n in notes.search_notes(conn, "O'Brien")] == ["O'Brien call"] and notes.search_notes(conn, "' OR '1'='1") == []


def delete_reports():
    conn = fresh(["Temp"])
    return notes.delete_note(conn, 1) is True and notes.delete_note(conn, 1) is False and notes.delete_note(conn, 99) is False


def one_query():
    conn = fresh()
    for i in range(30):
        notes.add_note(conn, f"Note {i}", "...", tags=["b", "a"])
    seen = []
    conn.set_trace_callback(seen.append)
    result = notes.notes_with_tags(conn)
    conn.set_trace_callback(None)
    selects = [s for s in seen if s.lstrip().upper().startswith("SELECT")]
    return len(selects) <= 1 and len(result) == 30 and result[0] == {"id": 1, "title": "Note 0", "tags": ["a", "b"]} and notes.notes_with_tags(fresh(["Lonely"])) == [{"id": 1, "title": "Lonely", "tags": []}]


check("search still works: case-insensitive, archived notes hidden unless asked for", search_works)
check("comment 1: a quote or an injection attempt in the search term is safe", search_is_safe)
check("comment 2: delete_note says whether it deleted anything", delete_reports)
check("comment 4: notes_with_tags uses a single query, with the same results", one_query)


# --- comment 3: names, read from the source ---
def names_are_clear():
    tree = ast.parse((here / "notes.py").read_text())
    for fn in [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]:
        for arg in fn.args.args:
            if len(arg.arg) < 3:
                return False
    return True


check("comment 3: no function takes a one- or two-letter parameter name", names_are_clear)


# --- comment 2, the tests: do yours actually catch the bugs? ---
def run_tests():
    suite = unittest.defaultTestLoader.loadTestsFromModule(test_notes)
    return unittest.TextTestRunner(stream=io.StringIO()).run(suite)


def test_count():
    return len(re.findall(r"^\s+def test_", (here / "test_notes.py").read_text(), re.M))


check("test_notes.py has at least five tests and they all pass", lambda: test_count() >= 5 and run_tests().wasSuccessful())


def survives(attribute, replacement):
    """True when your tests still pass even though we broke the code on purpose."""
    original = getattr(notes, attribute, None)
    setattr(notes, attribute, replacement)
    try:
        return run_tests().wasSuccessful()
    finally:
        if original is None:
            delattr(notes, attribute)
        else:
            setattr(notes, attribute, original)


def naive_search(conn, term, include_archived=False):
    sql = "SELECT id, title FROM notes WHERE title LIKE '%" + term + "%'"
    if not include_archived:
        sql += " AND archived = 0"
    return [{"id": row[0], "title": row[1]} for row in conn.execute(sql)]


check("your tests catch a delete_note that always says True", lambda: not survives("delete_note", lambda conn, note_id: True))
check("your tests catch a search built by joining strings into the SQL", lambda: not survives("search_notes", naive_search))


# --- taking and giving review: the writing ---
def reply_done():
    text = (here / "REPLY.md").read_text()
    sections = re.split(r"^## Comment \d\s*$", text, flags=re.M)[1:]
    return len(sections) == 4 and all(len(s.split()) >= 10 for s in sections)


def review_done():
    text = (here / "my-review.md").read_text()
    labels = {label: re.search(rf"^{label}:\s*\S.+", text, re.M) for label in ("blocking", "nit", "praise")}
    flagged = re.search(r"^blocking:.*(is_admin|except|fail|True)", text, re.M | re.I)
    return all(labels.values()) and bool(flagged)


check("REPLY.md answers all four comments", reply_done)
check("my-review.md gives a labelled review of other.patch, with a blocking comment about the real problem", review_done)
