"""Prints a summary for each sample log. Run it with: python3 run_report.py"""
from report import error_paths, parse_line, slowest, top_paths


def load(name):
    with open(name) as f:
        return [parse_line(line) for line in f.read().splitlines() if line.strip()]


for name in ("sample_monday.log", "sample_tuesday.log"):
    entries = load(name)
    print(name)
    print("  top 3 pages:   ", top_paths(entries, 3))
    print("  slowest request:", slowest(entries)["path"], slowest(entries)["ms"], "ms")
    print("  pages with server errors:", error_paths(entries))
