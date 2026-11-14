# tests.py: Check my work runs this file. It uses an obviously fake key and a pretend API
# on your own machine (no internet). Read it, but don't change it.
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

here = Path.cwd().resolve()
FAKE = "test-key-not-real-4321"
seen = []


class Pretend(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        seen.append(self.headers.get("Authorization", ""))
        ok = self.headers.get("Authorization") == "Bearer " + FAKE
        data = json.dumps({"plan": "free"} if ok else {"error": "bad key"}).encode()
        self.send_response(200 if ok else 401)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


server = HTTPServer(("127.0.0.1", 0), Pretend)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_address[1]}"


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def ignored(paths):
    """Ask Git, in a throwaway repo with a copy of your .gitignore, which of these paths it would ignore."""
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["git", "init", "-q", tmp], capture_output=True)
        (Path(tmp) / ".gitignore").write_text((here / ".gitignore").read_text())
        for p in paths:
            (Path(tmp) / p).touch()
        return {p: subprocess.run(["git", "check-ignore", "-q", p], cwd=tmp).returncode == 0 for p in paths}


def parse_sample():
    with tempfile.TemporaryDirectory() as tmp:
        sample = Path(tmp) / ".env"
        sample.write_text('# a comment\n\nONE=1\nTWO = "two words"\nTHREE=\'x\'\nFOUR=a=b=c\nexport FIVE=5\nALREADY=from-file\n')
        os.environ["ALREADY"] = "from-shell"
        loaded = main.load_env(str(sample))
        return loaded, dict(os.environ)


loaded, env = parse_sample()
check("load_env reads values and skips comments", lambda: loaded.get("ONE") == "1" and env.get("ONE") == "1" and not any(k.startswith("#") for k in loaded))
check("load_env strips quotes and spaces, keeps = in values", lambda: env.get("TWO") == "two words" and env.get("THREE") == "x" and env.get("FOUR") == "a=b=c" and env.get("FIVE") == "5")
check("load_env never overwrites a variable already set", lambda: env.get("ALREADY") == "from-shell")
check("a missing .env file is fine", lambda: main.load_env("no-such-file.env") == {})
check("mask shows only the last four characters", lambda: main.mask(FAKE) == "****4321" and main.mask("short") == "****" and FAKE not in main.mask(FAKE))

os.environ.pop("MISSING_KEY_FOR_TEST", None)


def missing_message():
    try:
        main.get_key("MISSING_KEY_FOR_TEST")
    except RuntimeError as error:
        return str(error)
    return None


check("a missing key gives a helpful error naming the variable", lambda: missing_message() and "MISSING_KEY_FOR_TEST" in missing_message() and ".env" in missing_message())

os.environ["SITE_API_KEY"] = FAKE
check("call_site_api sends the key from the environment", lambda: main.call_site_api(base) == {"plan": "free"} and seen[-1] == "Bearer " + FAKE)
os.environ["SITE_API_KEY"] = "test-key-not-real-0000"


def rejected_with_the_new_key():
    try:
        main.call_site_api(base)
    except Exception:
        return seen[-1] == "Bearer test-key-not-real-0000"
    return False


check("it follows the environment, not a fixed value", rejected_with_the_new_key)

source = "\n".join(l for l in Path("main.py").read_text().splitlines() if not l.strip().startswith("#"))
check("no key is typed into main.py", lambda: "test-key-not-real" not in source and not re.search(r"""["'][A-Za-z0-9_\-]{24,}["']""", source))

with tempfile.TemporaryDirectory() as tmp:
    (Path(tmp) / ".env").write_text(f"SITE_API_KEY={FAKE}\n")
    env_for_run = {k: v for k, v in os.environ.items() if k != "SITE_API_KEY"}
    run = subprocess.run([sys.executable, str(here / "main.py")], cwd=tmp, env=env_for_run, capture_output=True, text=True)
check("running main.py shows only the end of the key", lambda: run.returncode == 0 and "4321" in run.stdout and FAKE not in run.stdout + run.stderr)

env_file = here / ".env"
check(".env exists and holds SITE_API_KEY", lambda: env_file.exists() and re.search(r"^SITE_API_KEY=\S+", env_file.read_text(), re.M))
check(".gitignore keeps .env out of Git, but not .env.example", lambda: (here / ".gitignore").exists() and (lambda r: r[".env"] and r[".env.local"] and not r[".env.example"])(ignored([".env", ".env.local", ".env.example"])))
server.shutdown()
