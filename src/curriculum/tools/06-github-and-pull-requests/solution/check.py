# check.py: Check my work runs this file. Read it, but don't change it.
import subprocess
from pathlib import Path

root = Path.cwd().resolve()
site = root / "site"
origin = root / "origin.git"


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def git(*args, cwd=site):
    done = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    return done.returncode, done.stdout.strip()


bare = origin.is_dir() and git("rev-parse", "--is-bare-repository", cwd=origin) == (0, "true")
local = (site / ".git").is_dir()
on_origin = lambda *a: git("--git-dir", str(origin), *a, cwd=root)[1] if bare else ""
here = lambda *a: git(*a)[1] if local else ""

check("origin.git is a bare repository", lambda: bare)
check("site is a repo with its own name and email", lambda: local and here("config", "--local", "user.name") != "" and here("config", "--local", "user.email") != "")
check("site's origin remote points at origin.git", lambda: local and Path(site, here("remote", "get-url", "origin")).resolve() == origin)
check("main on origin has the footer", lambda: bare and "<footer" in on_origin("show", "main:index.html"))
check("origin's main ends in a merge commit", lambda: bare and len(on_origin("rev-list", "--parents", "-n", "1", "main").split()) == 3)
check("the footer commit and the merge both reached origin", lambda: bare and int(on_origin("rev-list", "--count", "--merges", "main") or 0) == 1 and int(on_origin("rev-list", "--count", "main") or 0) >= 3)
check("local main tracks origin/main and is up to date", lambda: local and here("rev-parse", "main") == here("rev-parse", "origin/main") == on_origin("rev-parse", "main"))
check("origin never received .env", lambda: bare and on_origin("log", "--all", "--oneline", "--", ".env") == "" and ".env" not in on_origin("ls-tree", "-r", "--name-only", "main").split())
check(".env exists here but Git ignores it", lambda: local and (site / ".env").exists() and git("check-ignore", ".env")[0] == 0)
