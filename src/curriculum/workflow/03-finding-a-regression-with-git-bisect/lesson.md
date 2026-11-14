Something worked last month and doesn't now. Forty commits sit between. Reading them all would take an afternoon. **git bisect** does it in about six steps.

It's binary search over your history. You tell Git one commit that's bad and one that was good. It checks out the middle, you say good or bad, and it halves the range again. Fourteen commits take around four tests. A thousand take ten.

## The standard

Don't hunt by hand. Write a test that fails when the bug is present, then hand it to Git to run on every candidate.

```bash
git bisect start
git bisect bad              # the current commit is broken
git bisect good v1.0        # this tag worked
git bisect run python3 test_slugify.py
```

`git bisect run <command>` runs the command at each step. Exit code **0** means good, **1 to 124** means bad, and **125** means "can't test this one, skip it". When Git finishes it prints the first bad commit: its hash, author and message.

Then you save the evidence and clean up:

```bash
git bisect log > ../bisect.log   # what you tested, and the verdicts
git bisect reset                  # back to where you started
```

**Always reset.** While a bisect is running you're on a detached HEAD, checked out at some old commit. Committing a fix there would put it on no branch at all.

## Why it works well

- It needs a test, so you get a regression test as a by-product. That's the same lesson as the last one.
- It finds the *commit*, which gives you the author's intent. "Speed up slug cleanup" tells you someone was optimising, which is a different fix from "someone made a typo".
- It doesn't need you to understand the code. That's why it's the first tool to reach for in a codebase you don't know.

Two cautions. The test has to exist at every commit you check, or the early ones will fail for the wrong reason (exit 125 is for that). And bisect assumes the bug appeared once and stayed. If it came and went, the answer won't be reliable.

## Your turn

1. From the lesson folder (not inside any other repo), run `bash setup.sh`. It builds a small repo called `app` with fourteen commits and a `v1.0` tag. Its identity is set for that repo only.
2. `cd app`, run `python3 test_slugify.py`, and see it fail.
3. Start a bisect, mark HEAD bad and `v1.0` good, then use `git bisect run` with the test script.
4. Save `git bisect log > ../bisect.log`, write the guilty commit's hash into `../answer.txt`, and run `git bisect reset`.
5. Fix `slugify.py`, and commit on `main`. Don't rewrite history. The point of a fix commit is that the history shows the bug and the repair.
6. Press **Check my work**.

> Tip: `git show <hash>` shows exactly what the guilty commit changed. Read it: the fix is usually one line in the diff.
