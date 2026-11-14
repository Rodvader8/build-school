"""Summarises a web server log. Each line is: date method path status milliseconds."""


def parse_line(line):
    date, method, path, status, ms = line.split()
    return {"date": date, "method": method, "path": path, "status": int(status), "ms": int(ms)}


def top_paths(entries, n):
    counts = {}
    for entry in entries:
        counts[entry["path"]] = counts.get(entry["path"], 0) + 1
    ranked = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))
    return ranked[:n]


def slowest(entries):
    return max(entries, key=lambda entry: entry["ms"])


def error_paths(entries, found=None):
    found = [] if found is None else found
    for entry in entries:
        if entry["status"] >= 500 and entry["path"] not in found:
            found.append(entry["path"])
    return found
