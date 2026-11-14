import unittest

import notes


class NotesTests(unittest.TestCase):
    def setUp(self):
        self.conn = notes.connect()

    def test_add_note_returns_an_id(self):
        self.assertEqual(notes.add_note(self.conn, "Hello", "World"), 1)

    def test_notes_come_back_with_their_tags(self):
        notes.add_note(self.conn, "Plan", "Ship it", tags=["work", "urgent"])
        self.assertEqual(notes.notes_with_tags(self.conn), [{"id": 1, "title": "Plan", "tags": ["urgent", "work"]}])

    def test_search_finds_a_title_ignoring_case(self):
        notes.add_note(self.conn, "Meeting notes", "...")
        self.assertEqual([n["title"] for n in notes.search_notes(self.conn, "meet")], ["Meeting notes"])

    def test_search_term_with_a_quote_is_safe(self):
        notes.add_note(self.conn, "O'Brien call", "...")
        self.assertEqual(len(notes.search_notes(self.conn, "O'Brien")), 1)
        self.assertEqual(notes.search_notes(self.conn, "' OR '1'='1"), [])

    def test_delete_reports_whether_anything_was_deleted(self):
        note_id = notes.add_note(self.conn, "Temp", "...")
        self.assertTrue(notes.delete_note(self.conn, note_id))
        self.assertFalse(notes.delete_note(self.conn, note_id))
        self.assertFalse(notes.delete_note(self.conn, 999))


if __name__ == "__main__":
    unittest.main()
