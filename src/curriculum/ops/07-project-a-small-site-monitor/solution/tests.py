# tests.py: Check my work runs this file. Read it, but don't change it.
# It starts a pretend internet on your own machine: pages that answer 200, 404, 500, hang,
# and one whose answer the test flips. It then walks a site through up, down and back, hour by hour.
import socket
import tempfile
import threading
import time
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

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


flip = {"status": 200}


class Pretend(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/slow":
            time.sleep(0.3)
        if self.path == "/hang":
            time.sleep(1.0)
        status = {"/boom": 500, "/missing": 404, "/flaky": flip["status"]}.get(self.path, 200)
        self.send_response(status)
        self.send_header("Content-Length", "2")
        self.end_headers()
        self.wfile.write(b"ok")


server = ThreadingHTTPServer(("127.0.0.1", 0), Pretend)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_address[1]}"

dead = socket.socket()
dead.bind(("127.0.0.1", 0))
dead_port = dead.getsockname()[1]
dead.close()  # nothing is listening here now: connection refused

status, ms = main.check_url(base + "/ok")
check("check_url reads status and timing", lambda: status == 200 and isinstance(ms, float) and 0 <= ms < 2000)
check("check_url returns error statuses", lambda: main.check_url(base + "/missing")[0] == 404 and main.check_url(base + "/boom")[0] == 500)
check("check_url measures slow pages", lambda: 250 <= main.check_url(base + "/slow")[1] < 1500)
check("check_url handles an unreachable site", lambda: main.check_url(f"http://127.0.0.1:{dead_port}/")[0] is None)
began = time.time()
check("check_url has a timeout", lambda: main.check_url(base + "/hang", timeout=0.2)[0] is None and time.time() - began < 0.8)

conn = main.connect(str(Path(tempfile.mkdtemp()) / "monitor.db"))
urls = [base + "/ok", base + "/flaky", base + "/boom"]
alerts = []
t0 = datetime(2026, 1, 1, 10, 5)

first = main.run_once(urls, conn, t0, alerts.append)
count = lambda: conn.execute("SELECT COUNT(*) FROM checks").fetchone()[0]
check("run_once records every url", lambda: count() == 3 and [r["url"] for r in first] == urls and [r["status"] for r in first] == [200, 200, 500])
check("first check does not alert", lambda: alerts == [])

again = main.run_once(urls, conn, t0 + timedelta(minutes=40), alerts.append)
check("same hour run is idempotent", lambda: count() == 3 and again == [] and alerts == [])

flip["status"] = 503
main.run_once(urls, conn, t0 + timedelta(hours=1), alerts.append)
check("going down alerts once", lambda: alerts == [f"DOWN: {base}/flaky (503)"] and count() == 6)

main.run_once(urls, conn, t0 + timedelta(hours=2), alerts.append)
check("staying down is quiet", lambda: len(alerts) == 1 and count() == 9)

flip["status"] = 200
main.run_once(urls, conn, t0 + timedelta(hours=3), alerts.append)
check("coming back alerts once", lambda: alerts == [f"DOWN: {base}/flaky (503)", f"UP again: {base}/flaky"] and count() == 12)

rows = main.latest(conn)
check("latest per url", lambda: [r["url"] for r in rows] == sorted(urls) and {r["url"]: r["status"] for r in rows} == {base + "/ok": 200, base + "/flaky": 200, base + "/boom": 500} and rows[0].keys() >= {"url", "status", "ms", "checked_at"} and all(r["checked_at"].startswith("2026-01-01T13") for r in rows))
server.shutdown()
