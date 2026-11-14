"""A frozen copy of report.py as it was when the bugs were reported. Don't edit it.
check.py runs your tests against this copy to prove they catch the bugs."""


def parse_line(line):
    date, method, path, status, ms = line.split()
    return {"date": date, "method": method, "path": path, "status": int(status), "ms": ms}


def top_paths(entries, n):
    counts = {}
    for entry in entries:
        counts[entry["path"]] = counts.get(entry["path"], 0) + 1
    ranked = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))
    return ranked[: n - 1]


def slowest(entries):
    return max(entries, key=lambda entry: entry["ms"])


def error_paths(entries, found=[]):
    for entry in entries:
        if entry["status"] >= 500 and entry["path"] not in found:
            found.append(entry["path"])
    return found
