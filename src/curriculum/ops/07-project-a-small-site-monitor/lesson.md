Time to put the track together. You're building the thing from the first lesson: a monitor that checks a list of websites on a schedule, remembers how each one did, and tells you only when something changes. It's about 60 lines of Python, and every piece is one you've already met.

## The pieces

| Job | Where you learned it |
|---|---|
| Request each URL and time it | the APIs track, with a timeout |
| Store status and timing | lesson 3 (SQLite) |
| Alert on change, never on state | lesson 6 |
| Safe to run twice | lesson 5 |
| Show the latest results | lesson 4 (the JSON endpoint) |
| Run every hour | lesson 2 (cron or a timer) |

## Making it idempotent with a bucket

Lesson 5 used a state file. Here the database does the same job. Each check is stored with an hour **bucket** such as `2026-01-01T10`, and the table says `UNIQUE (url, bucket)`. Then:

```sql
INSERT OR IGNORE INTO checks (...) VALUES (...)
```

The first run in an hour inserts a row. A second run in the same hour hits the uniqueness rule and is quietly ignored. No duplicate row, and because you only alert when a row was actually inserted, no duplicate alert either. `cursor.rowcount` tells you which happened: 1 for inserted, 0 for ignored.

Cron fires at the top of the hour, and if you run the script by hand at 10:40 to test, it won't muddy the 10:00 record.

## The order matters

For each URL:

1. Look up the **previous** status (the newest row from an earlier bucket) first.
2. Check the URL.
3. Record the new row.
4. If the row was newly inserted *and* there was a previous status, ask `describe_change` whether to send an alert.

Read the previous status before you record, or you'll compare the new result with itself and never see a change.

## What counts as down

A 200 to 399 status is up. A 404 or 500 is a real answer from a working server, so `check_url` returns it as a number and doesn't raise. A refused connection or a timeout gets no answer at all, and that's `None`. All three are "down" for alert purposes, and `describe_change` (given to you) already handles that.

## Testing with a pretend internet

Your tests start a mock server with pages that answer 200, 404, 500, or hang, and one whose answer the test can flip. That lets them walk a site through up, down, still down and back up, one simulated hour at a time, and count the alerts. This is the most useful trick in the whole track: when the outside world is what you're testing, build a small fake of it.

## Your turn

`main.py` already has the schema, `connect`, `is_up` and `describe_change`. Write the five functions marked TODO.

1. `check_url(url, timeout=5)`: returns `(status, ms)`, or `(None, None)` if nothing answered.
2. `record(...)`: inserts the row, and returns whether it was new.
3. `previous_status(conn, url, bucket)`: the status of the newest earlier bucket, or `UNKNOWN`.
4. `run_once(urls, conn, now, notify)`: the loop above. Return a list of `{"url", "status", "ms"}` for each row recorded this run.
5. `latest(conn)`: the newest row for every URL, sorted by URL, as dicts. That's the payload for the dashboard from lesson 4.

When it passes, put `python3 main.py` in a crontab line (don't install it unless you mean to), point it at sites you look after in `urls.txt`, and you have a real tool.

> To see it in a browser, pass `lambda: latest(conn)` to `make_server` from lesson 4. That's a dashboard for the monitor in about three more lines.
