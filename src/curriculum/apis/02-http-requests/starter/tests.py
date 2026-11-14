# tests.py: Check my work runs this file. It starts a pretend PageSpeed-style API on your
# own machine (no internet is used) and calls your code against it. Read it, but don't change it.
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

seen = []  # what the pretend API was asked, so the checks can look


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
        parsed = urlparse(self.path)
        query = {k: v[0] for k, v in parse_qs(parsed.query).items()}
        seen.append({"method": "GET", "path": parsed.path, "query": query, "agent": self.headers.get("User-Agent", "")})
        if parsed.path != "/pagespeedonline/v5/runPagespeed" or query.get("url") == "https://gone.example/":
            return self.reply(404, {"error": {"message": "not found"}})
        score = 0.93 if query.get("strategy") == "mobile" else 0.99
        self.reply(200, {"lighthouseResult": {"categories": {"performance": {"score": score}}}})

    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        seen.append({"method": "POST", "path": self.path, "type": self.headers.get("Content-Type", ""), "body": body.decode()})
        self.reply(201, {"id": "evt_123"})


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


page = "https://larkfield.example/work?a=1&b=2"
check("performance_score returns 93 for mobile", lambda: main.performance_score(base, page) == 93)
check("it sent the page address and strategy as query parameters", lambda: seen[-1]["query"] == {"url": page, "strategy": "mobile"})
check("the strategy can be changed", lambda: main.performance_score(base, page, "desktop") == 99 and seen[-1]["query"]["strategy"] == "desktop")
check("a 404 gives None, not a crash", lambda: main.performance_score(base, "https://gone.example/") is None)
check("post_score sends JSON and returns the id", lambda: main.post_score(base, "larkfield", 93) == "evt_123" and seen[-1]["type"].startswith("application/json") and json.loads(seen[-1]["body"]) == {"site": "larkfield", "score": 93})
check("the urllib version gets the same answer", lambda: main.performance_score_urllib(base, page) == 93 and seen[-1]["query"]["url"] == page)
check("the urllib version sends a User-Agent", lambda: seen[-1]["agent"] == "build-school/1.0")
source = "\n".join(l for l in open("main.py").read().splitlines() if not l.strip().startswith("#"))
check("every call sets a timeout", lambda: source.count("timeout=") >= 3)
server.shutdown()
