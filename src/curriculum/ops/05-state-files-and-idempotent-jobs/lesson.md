A job that runs on a schedule will, sooner or later, run twice. A cron entry gets duplicated. You run it by hand to test while the timer fires. The laptop wakes up and catches up on a missed run. If running twice sends two digest emails or bills a customer twice, that's a bug waiting for the wrong afternoon.

The word for the fix is **idempotent**: running it twice leaves things exactly as running it once did. The tool for it is a small **state file** that remembers what's already done.

## Remembering what's done

```python
state = {"done": ["order-1", "order-2"]}
```

```python
for item in items:
    if item["id"] in state["done"]:
        continue            # already handled, skip
    handle(item)
    state["done"].append(item["id"])
```

Run it again and every item is skipped. Add one new item, and only that one is handled. Notice the unit of work needs a stable **id**. Timestamps and list positions change between runs, so they don't count.

## Save after each item, not at the end

If the job handles 50 items and crashes on item 30, you want items 1 to 29 remembered. Save the state inside the loop, straight after each success. And if `handle(item)` raises, mark nothing: the item stays "not done", so the next run retries it. That's what makes a crash harmless.

## Atomic writes

Here's a subtler failure. You're halfway through writing `state.json` when the power goes, or the disk fills. The file now holds half of a JSON document, and the next run can't read it.

The fix is to never write to the real file directly. Write a new file next to it, then swap it into place in one step:

```python
import os, tempfile

fd, temp = tempfile.mkstemp(dir=folder)       # same folder, so the swap is on one disk
with os.fdopen(fd, "w") as f:
    json.dump(state, f)
os.replace(temp, path)                        # all or nothing
```

`os.replace` is **atomic**: any other program sees either the whole old file or the whole new one, never a mixture. It's the same reason a database writes a journal first.

## Don't hide a broken state file

If `state.json` is unreadable, the tempting fix is `except: state = {}` and carry on. Don't. An empty state means "nothing is done", so the job would redo everything, including sending every old email again. Stop with a clear error that names the file and let a human look.

## Overlapping runs

A state file protects against runs one after another. It doesn't stop two copies running at the same moment. On Linux the usual answer is `flock`, as in `flock -n /tmp/job.lock ./job.sh`, which refuses to start if the last run is still going.

## Your turn

Open `main.py` and write three functions.

1. `load_state(path)`: return the saved state, `{"done": []}` if the file isn't there yet, and raise a `ValueError` that includes the file name if it can't be parsed.
2. `save_state(path, state)`: write atomically. A failure must leave the old file untouched and no temp file behind.
3. `process_new(items, handler, state_path)`: call `handler(item)` once for each item not yet done, save after each one, and return the ids it handled this time.

> The tests break `os.replace` on purpose, to prove a failed save can't damage the old file. That's the kind of test worth copying for your own jobs.
