# Reply to the review

Answer each comment in a sentence or two: what you changed and where, or why you didn't. Reviewers shouldn't have to dig through the diff to find out.

## Comment 1

Fixed in search_notes: the term is now passed as a query parameter, so a quote or a stray OR is just text. Covered by test_search_term_with_a_quote_is_safe.

## Comment 2

delete_note now returns whether a row was deleted, using rowcount. I added tests for deleting a note that exists, deleting it again, and deleting an unknown id, plus the quote test from comment 1.

## Comment 3

Renamed proc to search_notes(conn, term, include_archived=False), and renamed the one-letter parameters. Nothing else in the repo called it.

## Comment 4

notes_with_tags is now one LEFT JOIN query grouped in Python, so it's a single round trip however many notes there are.
