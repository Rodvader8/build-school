# Lesson 6: read bookings.csv, summarise it, and write summary.json.
import csv
import json
from pathlib import Path


def read_bookings(path):
    """Return a list of dicts, one per row, with nights and rate as whole numbers."""
    with open(path, newline="") as file:
        rows = list(csv.DictReader(file))
    for row in rows:
        row["nights"] = int(row["nights"])
        row["rate"] = int(row["rate"])
    return rows


def summarise(rows):
    """Return {"bookings": ..., "nights": ..., "revenue": ..., "by_room": {room: revenue}}."""
    by_room = {}
    for row in rows:
        amount = row["nights"] * row["rate"]
        by_room[row["room"]] = by_room.get(row["room"], 0) + amount
    return {
        "bookings": len(rows),
        "nights": sum(row["nights"] for row in rows),
        "revenue": sum(by_room.values()),
        "by_room": by_room,
    }


def main():
    """Read bookings.csv, summarise it, and save summary.json."""
    summary = summarise(read_bookings(Path("bookings.csv")))
    Path("summary.json").write_text(json.dumps(summary, indent=2))
    print(f"{summary['bookings']} bookings, ${summary['revenue']:,} revenue")


if __name__ == "__main__":
    main()
