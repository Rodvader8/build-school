# Review of "Add search and delete to the notes store"

Thanks for this, the shape of it is good: small functions, and `notes_with_tags` is a handy addition. A few things to sort out before it merges.

## Comment 1 (blocking): `proc`, the SQL line
The search term is joined straight into the SQL string. A title like `O'Brien` raises an error, and a term like `' OR '1'='1` returns every note, archived ones included. Use a query parameter (`?`) so the database treats the term as data, not as code.

## Comment 2 (blocking): `delete_note`, and the tests
`delete_note` returns `True` even when the id didn't exist, so a caller can't tell "deleted" from "nothing there". It should return whether a row was actually deleted. Neither this nor the search has a test, which is how it got this far. Please add tests for: a search term containing a quote, deleting a note that exists, and deleting one that doesn't.

## Comment 3 (should fix): `proc(c, t, a)`
I had to read the body to find out what this does. Please rename it `search_notes(conn, term, include_archived=False)`, and update anything that calls it.

## Comment 4 (should fix): `notes_with_tags`
This runs one query for the notes and then one more per note to fetch its tags. With 500 notes that's 501 round trips. It can be a single query with a join.
