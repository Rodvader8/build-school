# check.py: Check my work runs this file. Read it, but don't change it.
# It only reads the files in this folder. It never touches your real crontab or systemd.
import re
from pathlib import Path


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


RANGES = [(0, 59), (0, 23), (1, 31), (1, 12), (0, 7)]


def expand(field, lo, hi):
    """'*/15' -> {0, 15, 30, 45}; '1-5' -> {1..5}; '6,18' -> {6, 18}. Raises ValueError if it isn't valid."""
    out = set()
    for part in field.split(","):
        step = 1
        if "/" in part:
            part, step_text = part.split("/", 1)
            step = int(step_text)
            if step < 1:
                raise ValueError("bad step")
        if part == "*":
            start, end = lo, hi
        elif "-" in part:
            start, end = (int(x) for x in part.split("-", 1))
        else:
            start = end = int(part)
        if not (lo <= start <= end <= hi):
            raise ValueError("out of range")
        out |= set(range(start, end + 1, step))
    return out


def jobs():
    """Every job line as (sets of minutes/hours/days/months/weekdays, command). Skips comments and NAME=value lines."""
    found = []
    for raw in Path("crontab.txt").read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or re.match(r"^[A-Za-z_]+\s*=", line):
            continue
        parts = line.split(None, 5)
        if len(parts) < 6:
            raise ValueError("a job needs five time fields and a command")
        fields = [expand(f, lo, hi) for f, (lo, hi) in zip(parts[:5], RANGES)]
        fields[4] = {d % 7 for d in fields[4]}  # 7 is Sunday too
        found.append((fields, parts[5]))
    return found


def find(script):
    for fields, command in jobs():
        if script in command:
            return fields
    return None


MINUTES, HOURS, DAYS, MONTHS, WEEKDAYS = (set(range(*r)) for r in [(0, 60), (0, 24), (1, 32), (1, 13), (0, 7)])


def schedule(script, minutes, hours, weekdays=WEEKDAYS):
    got = find(script)
    return got is not None and got == [minutes, hours, DAYS, MONTHS, weekdays]


def units(name):
    """A systemd unit file as {section: [(key, value), ...]}."""
    sections, current = {}, None
    for raw in Path(name).read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("[") and line.endswith("]"):
            current = sections.setdefault(line[1:-1], [])
        elif current is not None and "=" in line:
            key, value = line.split("=", 1)
            current.append((key.strip(), value.strip()))
    return sections


def values(unit, section, key):
    return [v for k, v in unit.get(section, []) if k == key]


check("every crontab line is valid", lambda: len(jobs()) >= 4)
check("digest runs daily at 07:30", lambda: schedule("digest.sh", {30}, {7}))
check("monitor runs every 15 minutes", lambda: schedule("monitor.sh", {0, 15, 30, 45}, HOURS))
check("report runs weekdays at 09:00", lambda: schedule("report.sh", {0}, {9}, {1, 2, 3, 4, 5}))
check("backup runs nightly at 02:00", lambda: schedule("backup.sh", {0}, {2}))
check("percent signs are escaped", lambda: len(jobs()) >= 4 and all(not re.search(r"(?<!\\)%", command) for _, command in jobs()) and any("\\%" in c for _, c in jobs()))

service = units("digest.service")
check("digest.service is a oneshot", lambda: values(service, "Service", "Type") == ["oneshot"] and any(v.startswith("/opt/tools/digest.sh") for v in values(service, "Service", "ExecStart")))

timer = units("digest.timer")
check("digest.timer fires at 07:30", lambda: any(re.fullmatch(r"(\*-\*-\*\s+)?07:30(:00)?", v) for v in values(timer, "Timer", "OnCalendar")))
check("timer is persistent and installable", lambda: values(timer, "Timer", "Persistent") == ["true"] and "timers.target" in values(timer, "Install", "WantedBy"))
