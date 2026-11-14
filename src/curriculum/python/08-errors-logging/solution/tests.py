# tests.py: Check my work runs this file. Read it to see exactly what is tested,
# but don't change it.
try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)

import logging


class Collect(logging.Handler):
    def __init__(self):
        super().__init__()
        self.records = []

    def emit(self, record):
        self.records.append(record)


def raises_value_error(text):
    try:
        main.parse_amount(text)
    except ValueError as error:
        return "amount" in str(error).lower()
    return False


check("parse_amount", lambda: main.parse_amount("4,400") == 4400 and main.parse_amount(" $13,200 ") == 13200)
check("parse_amount refuses text", lambda: raises_value_error("about four grand"))
check("parse_amount refuses negatives", lambda: raises_value_error("-50"))

handler = Collect()
logging.getLogger().addHandler(handler)
logging.getLogger().setLevel(logging.DEBUG)
total = main.total_amounts(["4,400", "oops", "7,700", "", "-5"])
check("total_amounts skips bad rows", lambda: total == 12100)
check("total_amounts logs a warning per bad row", lambda: sum(1 for r in handler.records if r.levelno == logging.WARNING) == 3)
check("uses logging, not print, for warnings", lambda: "logging" in open("main.py").read() and "getLogger" in open("main.py").read())
