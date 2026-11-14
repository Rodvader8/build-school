import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Code review: giving and taking it',
  minutes: 45,
  kind: 'python',
  entry: 'REVIEW.md',
  checkEntry: 'check.py',
  checks: outputChecks([
    'search_notes exists with the requested signature, and proc is gone',
    'search still works: case-insensitive, archived notes hidden unless asked for',
    'comment 1: a quote or an injection attempt in the search term is safe',
    'comment 2: delete_note says whether it deleted anything',
    'comment 4: notes_with_tags uses a single query, with the same results',
    'comment 3: no function takes a one- or two-letter parameter name',
    'test_notes.py has at least five tests and they all pass',
    'your tests catch a delete_note that always says True',
    'your tests catch a search built by joining strings into the SQL',
    'REPLY.md answers all four comments',
    'my-review.md gives a labelled review of other.patch, with a blocking comment about the real problem',
  ]),
  hints: [
    'A query parameter replaces the value, not the SQL. Write the statement with a ? and pass the value separately: conn.execute("... WHERE title LIKE ?", ("%" + term + "%",)). The % signs belong to the value, not the statement.',
    'sqlite3 tells you how many rows a DELETE touched: conn.execute(...).rowcount. For the N+1 fix, one LEFT JOIN returns a row per note-and-tag pair, and you group them in Python with a dict keyed by note id.',
    'The checks break your code on purpose and ask whether your tests notice. Call the functions through the module (notes.delete_note(...)), as the existing tests do, and assert on the returned value, not just that nothing raised.',
  ],
} satisfies LessonMeta;
