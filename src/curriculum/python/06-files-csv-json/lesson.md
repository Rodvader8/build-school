Most automation is: read a file, work something out, write a file. Traffic reports, daily digests and site monitor exports all do exactly this. Open **bookings.csv** in the Explorer: a week of Brightwater bookings, exported from a booking system.

## Reading a CSV

```python
import csv

with open("bookings.csv", newline="") as file:
    rows = list(csv.DictReader(file))
```

- `import csv` loads Python's built-in CSV tools. Python comes with a huge **standard library**: no installing needed.
- `with open(...) as file:` opens the file and **closes it automatically** when the block ends, even if something goes wrong.
- `csv.DictReader` turns each row into a dict, using the header row for the keys.

**Everything from a CSV is a string.** `"3"` isn't `3`. Convert with `int()`:

```python
row["nights"] = int(row["nights"])
```

## Adding things up

```python
by_room[room] = by_room.get(room, 0) + amount   # .get gives 0 the first time
sum(row["nights"] for row in rows)              # add up a value from every row
```

## Writing JSON

```python
import json
from pathlib import Path

Path("summary.json").write_text(json.dumps(summary, indent=2))
```

`pathlib.Path` is the modern way to work with files and folders. `json.dumps` turns a dict into JSON text, the same format your JavaScript fetched in the JS track.

## Your turn

Fill in the three functions:

1. `read_bookings(path)`: a list of dicts, with `nights` and `rate` converted to `int`.
2. `summarise(rows)`: the number of bookings, total nights, total revenue, and revenue `by_room`.
3. `main()`: read, summarise, write `summary.json`, and print a one-line summary.

Press Run, and **summary.json** appears in the Explorer.
