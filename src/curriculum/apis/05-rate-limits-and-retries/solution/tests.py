# tests.py: Check my work runs this file. It starts a pretend, grumpy API on your own machine
# (no internet): it says 429, then 503, then drops a reply. The sleeps are recorded instead of
# waited out, so this runs in a blink. Read it, but don't change it.
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

calls = {}  # path -> how many times it was asked
charges = {}  # Idempotency-Key -> charge
post_keys = []  # the key on every POST to /v1/charges


class Pretend(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, body, headers=None):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        n = calls[self.path] = calls.get(self.path, 0) + 1
        if self.path == "/v1/limited":
            return self.reply(429, {"error": "slow down"}, {"Retry-After": "2"}) if n == 1 else self.reply(200, {"pages": 12})
        if self.path == "/v1/flaky":
            return self.reply(503, {"error": "busy"}) if n <= 2 else self.reply(200, {"ok": True})
        if self.path == "/v1/down":
            return self.reply(500, {"error": "broken"})
        self.reply(404, {"error": "not found"})

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
        key = self.headers.get("Idempotency-Key")
        post_keys.append(key)
        if not key:
            return self.reply(400, {"error": "Idempotency-Key required"})
        if key in charges:
            return self.reply(200, charges[key])
        charges[key] = {"id": f"ch_{len(charges) + 1}", "amount": body["amount"]}
        if len(post_keys) == 1:  # the charge was made, but the reply never arrives
            return self.reply(500, {"error": "oops, lost the reply"})
        self.reply(200, charges[key])


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


def run(path, **kwargs):
    slept = []
    try:
        result = main.request_with_retries("GET", base + path, sleep=slept.append, **kwargs)
        return result, slept, None
    except Exception as error:
        return None, slept, error


result, slept, _ = run("/v1/limited")
check("a 429 waits for Retry-After, then succeeds", lambda: result is not None and result.json() == {"pages": 12} and slept == [2.0] and calls["/v1/limited"] == 2)

result, slept, _ = run("/v1/flaky")
check("a 503 backs off 0.5 then 1.0 seconds", lambda: result is not None and result.json() == {"ok": True} and slept == [0.5, 1.0])

result, slept, error = run("/v1/down", max_tries=3)
check("it gives up after max_tries with a clear error", lambda: result is None and isinstance(error, RuntimeError) and "3" in str(error) and calls["/v1/down"] == 3)
check("it doesn't sleep after the last try", lambda: slept == [0.5, 1.0])

result, slept, error = run("/v1/missing")
check("a 404 is not retried", lambda: isinstance(error, requests.HTTPError) and calls["/v1/missing"] == 1 and slept == [])

charge = None
try:
    charge = main.create_charge(base, 5000, sleep=lambda s: None)
except Exception as error:
    print(f"  (create_charge raised {error!r})")
check("create_charge survives a lost reply", lambda: charge is not None and charge["amount"] == 5000)
check("it retried with the same Idempotency-Key", lambda: len(post_keys) >= 2 and len(set(post_keys)) == 1 and post_keys[0])
check("so only one charge was made", lambda: len(charges) == 1)
server.shutdown()
