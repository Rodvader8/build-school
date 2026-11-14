# tests.py: Check my work runs this file. It starts a small pretend API on your own
# machine (no internet is used) and calls your code against it. Read it, but don't change it.
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

SITES = {
    "sites": [
        {"name": "brightwater.example", "status": "up", "ms": 212},
        {"name": "ironbark.example", "status": "up", "ms": 305},
        {"name": "larkfield.example", "status": "down", "ms": None},
    ]
}


class Pretend(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/v1/sites":
            self.reply(200, SITES)
        else:
            self.reply(404, {"error": "not found"})


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


check("build_url joins the pieces", lambda: main.build_url("https://x.test/", "/v1/sites") == "https://x.test/v1/sites" and main.build_url("https://x.test", "v1/sites") == "https://x.test/v1/sites")
check("build_url adds a query string", lambda: main.build_url("https://x.test", "/v1/sites", {"status": "down", "limit": 5}) == "https://x.test/v1/sites?status=down&limit=5")
check("build_url escapes awkward characters", lambda: main.build_url("https://x.test", "/s", {"q": "a b&c"}) == "https://x.test/s?q=a+b%26c")
check("status_class names the families", lambda: [main.status_class(c) for c in (200, 301, 404, 429, 503)] == ["success", "redirect", "client error", "client error", "server error"])
check("get_json returns the status and the data", lambda: main.get_json(base + "/v1/sites") == (200, SITES))
check("get_json treats a 404 as an answer", lambda: main.get_json(base + "/v1/nope") == (404, {"error": "not found"}))
check("summarise reports what's down", lambda: main.summarise(SITES) == "3 sites, 1 down: larkfield.example")
check("summarise says all up", lambda: main.summarise({"sites": [{"name": "a", "status": "up", "ms": 1}, {"name": "b", "status": "up", "ms": 2}]}) == "2 sites, all up")
server.shutdown()
