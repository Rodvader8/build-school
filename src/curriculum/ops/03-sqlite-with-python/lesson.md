A site monitor that runs every hour needs a memory. Was the site fine last time? How slow has it been this week? A text file works for a day or two, then it turns into a mess of half-written lines. **SQLite** is a whole database in a single file, built into Python, with nothing to install or run. It's what phones, browsers and plenty of real products use for exactly this job.

## The shape of it

```python
import sqlite3

conn = sqlite3.connect("monitor.db")      # makes the file if it isn't there
conn.row_factory = sqlite3.Row            # rows you can read by column name
conn.execute("CREATE TABLE IF NOT EXISTS checks (id INTEGER PRIMARY KEY, url TEXT NOT NULL, status INTEGER)")
```

A **table** is a grid: one row per check, one column per fact. `IF NOT EXISTS` means running the same setup twice does no harm, which matters for anything on a schedule.

## Writing: always use placeholders

```python
conn.execute("INSERT INTO checks (url, status) VALUES (?, ?)", (url, status))
conn.commit()
```

The `?` marks are **placeholders**, and the values travel separately in a tuple. Never build the SQL with an f-string. If a URL contained `'); DROP TABLE checks;--` and you pasted it into the query text, it would run as SQL. With placeholders it's only ever data. That's the whole defence against SQL injection, and it costs nothing.

The `commit()` matters too. Until you commit, the change lives in your connection only. A crash, or another program reading the file, wouldn't see it.

## Reading

```python
rows = conn.execute("SELECT url, ms FROM checks ORDER BY ms DESC LIMIT ?", (3,)).fetchall()
for row in rows:
    print(row["url"], row["ms"])
```

`fetchall()` gives a list, `fetchone()` gives one row or `None`. SQL can also do the sums for you:

```sql
SELECT COUNT(*), SUM(CASE WHEN status BETWEEN 200 AND 399 THEN 1 ELSE 0 END) FROM checks WHERE url = ?
```

Letting the database count is far quicker than looping in Python once you have thousands of rows.

## NULL

A check that couldn't connect has no status and no timing. Store that as `None` (SQL's `NULL`). A NULL is "unknown", so it's never equal to, or between, anything. That's handy, but it can surprise you, so test it.

## Your turn

Open `main.py`. The schema is written for you. Fill in the five functions, then press Check my work.

1. `connect(path)`: open the file, set the row factory, run the schema.
2. `add_check(...)`: insert a row with placeholders, and commit.
3. `latest_status(conn, url)`: the status of the newest check (by `checked_at`, not by row number), or `None`.
4. `slowest(conn, limit)`: the slowest `(url, ms)` pairs, slowest first, ignoring checks with no timing.
5. `uptime_percent(conn, url)`: the share of checks that were 2xx or 3xx, rounded to one decimal place, or `None` if there are none.

> The `tests.py` file shows exactly what's being asked. Reading a test is a good way to learn what a function should do.
