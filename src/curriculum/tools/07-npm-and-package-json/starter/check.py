# check.py: Check my work runs this file. Read it, but don't change it.
import json
import subprocess
import tempfile
from pathlib import Path

tool = Path("tool").resolve()


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def package():
    return json.loads((tool / "package.json").read_text())


def ignored(patterns):
    """Ask Git, in a throwaway repo holding a copy of the student's .gitignore, which of these paths it would ignore."""
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["git", "init", "-q", tmp], capture_output=True)
        (Path(tmp) / ".gitignore").write_text((tool / ".gitignore").read_text())
        for p in patterns:  # real files, so a rule like "node_modules/" sees a folder
            (Path(tmp) / p).parent.mkdir(parents=True, exist_ok=True)
            (Path(tmp) / p).touch()
        return {p: subprocess.run(["git", "check-ignore", "-q", p], cwd=tmp).returncode == 0 for p in patterns}


run = subprocess.run(["npm", "run", "--silent", "slugs"], cwd=tool, capture_output=True, text=True) if (tool / "package.json").exists() else None

check("package.json exists with a name", lambda: package().get("name"))
check("slug-lite is listed as a dependency", lambda: "slug-lite" in package().get("dependencies", {}))
check("package-lock.json exists and knows slug-lite", lambda: "node_modules/slug-lite" in json.loads((tool / "package-lock.json").read_text()).get("packages", {}))
check("node_modules has slug-lite installed", lambda: (tool / "node_modules/slug-lite/index.js").exists())
check("npm run slugs works", lambda: run and run.returncode == 0 and run.stdout.split() == ["larkfield-coastal-reno", "brightwater-pool-spa", "willow-cove-builders"])
check("the slugs script runs slugs.js", lambda: "slugs.js" in package().get("scripts", {}).get("slugs", ""))
check(".gitignore keeps node_modules out of Git", lambda: all(ignored(["node_modules/slug-lite/index.js"]).values()))
check(".gitignore keeps .env out, but not .env.example", lambda: (lambda r: r[".env"] and r[".env.local"] and not r[".env.example"] and not r["package-lock.json"])(ignored([".env", ".env.local", ".env.example", "package-lock.json"])))
