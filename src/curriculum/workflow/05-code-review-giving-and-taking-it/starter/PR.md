# Pull request: "Add search and delete to the notes store"

**Author:** a teammate. **Branch:** `notes-search`. **Files changed:** `notes.py`

Adds a way to find notes by title, shows notes with their tags in one list, and lets a note be deleted.

- `proc` finds notes by a piece of the title. Archived notes are hidden unless asked for.
- `notes_with_tags` returns every live note with its tags.
- `delete_note` removes a note by id.

Tests: the existing ones pass.

---

You're the author now. The reviewer's comments are in `REVIEW.md`. The code in `notes.py` is the branch as it was submitted.
