# check.py: Check my work runs this file. Read it, but don't change it.
import re
import subprocess
import sys
from pathlib import Path

root = Path.cwd()
app = root / "app"


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def git(*args):
    """Run git inside app/ and return (exit code, stdout). Never touches global config."""
    done = subprocess.run(["git", *args], cwd=app, capture_output=True, text=True)
    return done.returncode, done.stdout.strip()


has_repo = (app / ".git").is_dir()  # app's own repo, not a parent folder's
g = lambda *a: git(*a)[1] if has_repo else ""
culprit = g("log", "--format=%H", "--grep=Speed up slug cleanup") if has_repo else ""

check("app/ is a repository with its own name and email", lambda: has_repo and g("config", "--local", "user.name") != "" and g("config", "--local", "user.email") != "")
check("the history is intact: the tag and the guilty commit are still there", lambda: has_repo and culprit != "" and git("rev-parse", "--verify", "v1.0")[0] == 0 and int(g("rev-list", "--count", "main")) >= 14)


def saved_log():
    text = (root / "bisect.log").read_text()
    judgments = re.findall(r"^git bisect (?:good|bad) ", text, re.M)
    return re.search(r"first '?bad'? commit", text) is not None and len(judgments) >= 4


def answer_is_culprit():
    answer = (root / "answer.txt").read_text().split()[0]
    code, full = git("rev-parse", "--verify", answer + "^{commit}")
    return len(answer) >= 7 and code == 0 and full == culprit


check("bisect.log shows a bisect that narrowed down to a first bad commit", saved_log)
check("answer.txt names the first bad commit", answer_is_culprit)
check("the bisect is finished: git bisect reset was run, and you're back on main", lambda: has_repo and not (app / ".git" / "BISECT_LOG").exists() and g("branch", "--show-current") == "main")
check("the tests pass at the tip of main", lambda: has_repo and subprocess.run([sys.executable, "test_slugify.py"], cwd=app, capture_output=True).returncode == 0)
check("the fix is a new commit on top of the old history", lambda: has_repo and culprit != "" and git("merge-base", "--is-ancestor", culprit, "main")[0] == 0 and int(g("rev-list", "--count", culprit + "..main")) >= 6)
check("nothing is left uncommitted", lambda: has_repo and g("status", "--porcelain") == "")
