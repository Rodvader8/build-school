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


if __name__ == "__main__":
    unittest.main()
