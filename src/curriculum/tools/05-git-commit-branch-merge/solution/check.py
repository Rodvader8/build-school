# check.py: Check my work runs this file. Read it, but don't change it.
import subprocess
from pathlib import Path

site = Path("site").resolve()


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def git(*args):
    """Run git inside site/ and return (exit code, stdout). Never touches global config."""
    done = subprocess.run(["git", *args], cwd=site, capture_output=True, text=True)
    return done.returncode, done.stdout.strip()


has_repo = (site / ".git").is_dir()  # not a parent folder's repo
g = lambda *a: git(*a)[1] if has_repo else ""

check("site is a Git repository on main", lambda: has_repo and g("branch", "--show-current") == "main")
check("this repo has its own name and email", lambda: has_repo and g("config", "--local", "user.name") != "" and g("config", "--local", "user.email") != "")
check("the nav-links branch exists and is merged", lambda: has_repo and g("rev-parse", "--verify", "nav-links") != "" and int(g("rev-list", "--count", "main..nav-links") or 0) == 0 and int(g("rev-list", "--count", "nav-links")) >= 2)
check("main has a real merge commit", lambda: has_repo and len(g("rev-list", "--parents", "-n", "1", "main").split()) == 3)
check("the merged page has the nav", lambda: has_repo and "<nav" in g("show", "main:index.html"))
check("the colour change on main survived the merge", lambda: has_repo and "#7c5cff" not in g("show", "main:style.css"))
check("nothing is left uncommitted", lambda: has_repo and g("status", "--porcelain") == "")
check(".env is ignored by Git", lambda: has_repo and git("check-ignore", ".env")[0] == 0 and git("check-ignore", ".env.example")[0] == 1)
check(".env.example and .gitignore are committed", lambda: has_repo and {".env.example", ".gitignore"} <= set(g("ls-files").split()))
check(".env was never committed, on any branch", lambda: has_repo and g("log", "--all", "--oneline", "--", ".env") == "" and ".env" not in g("ls-files").split())
