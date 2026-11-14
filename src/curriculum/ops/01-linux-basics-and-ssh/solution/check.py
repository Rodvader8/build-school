# check.py: Check my work runs this file. Read it, but don't change it.
# It only reads files in this folder and runs run.sh. It never connects to anything.
import os
import subprocess
from pathlib import Path


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def answers():
    out = {}
    for line in Path("steps.txt").read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            out[key.strip()] = value.strip()
    return out


def greeting(**env):
    clean = {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), **env}  # no NAME unless we add it
    return subprocess.run(["bash", "run.sh"], capture_output=True, text=True, env=clean, timeout=10).stdout.strip()


def host_block():
    """The lines of the 'Host webserver' block, as {lowercase key: value}."""
    block, inside = {}, False
    for raw in Path("ssh_config").read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition(" ")
        if key.lower() == "host":
            inside = value.strip() == "webserver"
        elif inside:
            block[key.lower()] = value.strip()
    return block


ans = answers()
block = host_block()

check("hello.sh is executable", lambda: Path("hello.sh").stat().st_mode & 0o100)
check(".env is private to you", lambda: Path(".env").is_file() and "=" in Path(".env").read_text() and Path(".env").stat().st_mode & 0o077 == 0)
check(".gitignore lists .env", lambda: ".env" in [l.strip() for l in Path(".gitignore").read_text().splitlines()])
check("run.sh reads NAME", lambda: greeting(NAME="Sam") == "Hello, Sam" and greeting() == "Hello, world")
check("permission answers", lambda: ans.get("PERMS_750") == "rwxr-x---" and ans.get("OCTAL_FOR_RW_R__R") == "644")
check("process and port answers", lambda: ans.get("LIST_PROCESSES") in ("ps", "top", "htop") and ans.get("STOP_PROCESS") == "kill" and ans.get("DEFAULT_SSH_PORT") == "22")
check("ssh_config host block", lambda: block.get("hostname") == "203.0.113.10" and block.get("user") == "deploy" and block.get("port") == "2222" and block.get("identityfile") == "~/.ssh/id_ed25519")
check("ssh_config uses IdentitiesOnly", lambda: block.get("identitiesonly", "").lower() == "yes")


def leaked_key():
    for path in Path(".").rglob("*"):
        if path.is_file() and path.name != "check.py":
            if path.name.startswith("id_") or "PRIVATE " + "KEY" in path.read_text(errors="ignore"):
                return True
    return False


check("no private key in the folder", lambda: not leaked_key())
