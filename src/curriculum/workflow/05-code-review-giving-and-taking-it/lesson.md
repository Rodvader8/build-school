Code review is where most of what you've learned in this stage gets used. It's also two separate skills: reading someone else's change critically, and hearing criticism of your own without taking it personally. This lesson makes you do both.

## Taking a review

Treat each comment as a small, separate task. Read all of them first, sort them by how much they matter, then work through them one at a time.

- **Fix the cause the reviewer named, then look for its twins.** If one query joins user input into SQL, look for the others.
- **Prove it.** A reviewer who says "this needs a test" is also telling you the bug could come back. A good test fails when the code is broken. The checks here verify that by breaking your code on purpose and seeing whether your tests notice.
- **Reply to every comment.** Say what you changed and where, so the reviewer can tick it off without re-reading the diff. If you disagree, say why, politely, with evidence.
- **Don't argue with the tone, answer the content.** Most of the time the reviewer is right about the problem and a bit off about the fix. Take the problem.

## Giving a review

A useful review is specific, ranked and kind.

- **Label each comment.** `blocking:` must change before merging. `nit:` is small and optional. `praise:` says what's good. Without labels, every comment looks equally urgent and the author can't tell what to do first.
- **Say what, why, and suggest a fix.** "This is wrong" is a feeling. "This joins input into SQL, so a quote breaks it; use a parameter" is a review.
- **Name the line or the function.** Don't make the author hunt.
- **Review the change, not the person.** "This returns True on errors" rather than "you've made this unsafe".
- **Find something to praise.** It's true more often than you'd think, and it's how people learn what to keep doing.

## Four things worth always checking

| Look for | Example |
|---|---|
| Security | User input joined into SQL, HTML or a shell command; a permission check that fails open |
| Missing tests | New behaviour with nothing that would fail if it broke |
| Unclear names | `proc(c, t, a)`; a variable called `x` |
| Performance traps | A query inside a loop (N+1); work repeated for every item |

## Your turn

1. Read `PR.md`, then `REVIEW.md`. Four comments, two of them blocking.
2. Open `notes.py`. It's the branch as submitted. Fix everything the review asks for, comment by comment.
3. Add the tests the review asks for to `test_notes.py`. Call the functions through the module (`notes.delete_note(...)`), so the checks can break them.
4. Fill in `REPLY.md`: a sentence or two under each comment.
5. Now review someone else. Read `other.patch` and write `my-review.md`: at least one `blocking:`, one `nit:` and one `praise:` comment. The blocking one should name the real problem.
6. Press **Check my work**.

> Tip: run `python3 -m unittest` as you go. Each fix should leave the tests green.
