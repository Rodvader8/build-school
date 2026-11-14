# tests.py: Check my work runs this file. Read it, but don't change it.
# Slack is pretended: a mock webhook server on your own machine records what it gets sent.
# notify-send is never run for real: the tests swap in a fake. Nothing leaves this computer.
import json
import os
import shutil
import subprocess
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests

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


received = []


class MockSlack(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        received.append({"path": self.path, "type": self.headers.get("Content-Type", ""), "body": body})
        if self.path == "/fail":
            status = 500
        else:
            status = 200
            if self.path == "/slow":
                time.sleep(1.0)
        self.send_response(status)
        self.send_header("Content-Length", "2")
        self.end_headers()
        self.wfile.write(b"ok")


server = HTTPServer(("127.0.0.1", 0), MockSlack)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_address[1]}"

saved = os.environ.get("SLACK_WEBHOOK_URL")
os.environ["SLACK_WEBHOOK_URL"] = base + "/services/FAKE"
check("webhook_url reads the environment", lambda: main.webhook_url() == base + "/services/FAKE")
del os.environ["SLACK_WEBHOOK_URL"]


def missing_error():
    try:
        main.webhook_url()
    except RuntimeError as error:
        return "SLACK_WEBHOOK_URL" in str(error)
    return False


check("missing webhook variable is a clear error", missing_error)
if saved is not None:
    os.environ["SLACK_WEBHOOK_URL"] = saved

result = main.send_slack(base + "/services/FAKE", "DOWN: https://a.example (503)")
check("send_slack posts json", lambda: result is True and len(received) == 1 and received[0]["type"].startswith("application/json") and json.loads(received[0]["body"]) == {"text": "DOWN: https://a.example (503)"})


def raises(function, kinds):
    try:
        function()
    except kinds:
        return True
    return False


check("send_slack raises on a bad reply", lambda: raises(lambda: main.send_slack(base + "/fail", "hi"), requests.RequestException))
started = time.time()
check("send_slack has a timeout", lambda: raises(lambda: main.send_slack(base + "/slow", "hi", timeout=0.3), requests.RequestException) and time.time() - started < 0.9)

check("describe_change messages", lambda: (
    main.describe_change("https://a.example", 200, 503) == "DOWN: https://a.example (503)"
    and main.describe_change("https://a.example", 301, None) == "DOWN: https://a.example (no response)"
    and main.describe_change("https://a.example", 500, 200) == "UP again: https://a.example"
    and main.describe_change("https://a.example", None, 204) == "UP again: https://a.example"
    and main.describe_change("https://a.example", 200, 200) is None
    and main.describe_change("https://a.example", 503, 404) is None
))

old = {"a": 200, "b": 200, "c": 503, "d": None, "f": 200}
new = {"a": 200, "b": 500, "c": 200, "d": None, "e": 500, "f": None}
sent = []
messages = main.alert_changes(old, new, sent.append)
check("alert_changes only on change", lambda: messages == ["DOWN: b (500)", "UP again: c", "DOWN: f (no response)"] and sent == messages)

calls = []
real_which, real_run = shutil.which, subprocess.run
try:
    shutil.which = lambda name, *a, **k: None
    subprocess.run = lambda *a, **k: calls.append(a) or subprocess.CompletedProcess(a, 0)
    missing = main.notify_desktop("Site down", "example.com")
    ran_when_missing = list(calls)

    shutil.which = lambda name, *a, **k: "/usr/bin/notify-send" if name == "notify-send" else None
    present = main.notify_desktop("Site down", "example.com")
finally:
    shutil.which, subprocess.run = real_which, real_run

check("notify_desktop skips when missing", lambda: missing is False and ran_when_missing == [])
check("notify_desktop runs notify-send", lambda: present is True and len(calls) == 1 and isinstance(calls[0][0], list) and calls[0][0][0].endswith("notify-send") and calls[0][0][-2:] == ["Site down", "example.com"])
server.shutdown()
