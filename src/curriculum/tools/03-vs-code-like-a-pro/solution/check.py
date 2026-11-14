# check.py: Check my work runs this file. Read it, but don't change it.
import re
import subprocess
from pathlib import Path


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


source = Path("monitor.js").read_text()
run = subprocess.run(["node", "monitor.js"], capture_output=True, text=True)
lines = run.stdout.splitlines()
code_lines = [l for l in source.splitlines() if not l.strip().startswith("//")]
code = "\n".join(code_lines)

check("monitor.js runs without errors", lambda: run.returncode == 0)
check("the five names are quoted strings", lambda: all(re.search(rf"""^\s*['"]{n}['"],\s*$""", source, re.M) for n in ["ironbark", "anchorline", "larkfield", "brightwater", "willowcove"]))
check("every address is https", lambda: run.returncode == 0 and "http://" not in code and sum(1 for l in lines if l.startswith("checked ")) == 5 and not any("not secure" in l for l in lines))
check("chk is renamed to checkSite everywhere", lambda: not re.search(r"\bchk\b", code) and len(re.findall(r"\bcheckSite\b", code)) >= 2)
check("the debug line is commented out", lambda: not any("DEBUG" in l for l in lines) and re.search(r"^\s*//\s*console\.log\('DEBUG", source, re.M))
check("TIMEOUT_MS sits above the function", lambda: re.search(r"const TIMEOUT_MS = 5000;", code) and code.index("TIMEOUT_MS") < code.index("function checkSite"))
