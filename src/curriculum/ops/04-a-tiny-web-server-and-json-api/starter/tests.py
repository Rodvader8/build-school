# tests.py: Check my work runs this file. Read it, but don't change it.
# It starts your server on a free port on this machine, asks it questions, then stops it.
import http.client
import json
import threading
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


DATA = [
    {"url": "https://a.example", "status": 200, "ms": 120.0},
    {"url": "https://b.example", "status": 503, "ms": 900.0},
    {"url": "https://c.example", "status": None, "ms": None},
]
current = {"data": DATA}

server = main.make_server(lambda: current["data"])
threading.Thread(target=server.serve_forever, daemon=True).start()
port = server.server_address[1]


def get(path):
    conn = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
    conn.request("GET", path)
    res = conn.getresponse()
    body = res.read()
    conn.close()
    return res.status, res, body


check("server listens on loopback only", lambda: server.server_address[0] == "127.0.0.1")

status, _, body = get("/health")
check("health check answers ok", lambda: status == 200 and body.strip() == b"ok")

status, res, body = get("/api/status")
check("api returns the data as json", lambda: status == 200 and json.loads(body) == DATA)
check("json has the right headers", lambda: res.getheader("Content-Type", "").startswith("application/json") and res.getheader("Content-Length") == str(len(body)))

current["data"] = [{"url": "https://new.example", "status": 200, "ms": 5.0}]
_, _, body = get("/api/status")
check("data is fresh on every request", lambda: json.loads(body) == current["data"])
current["data"] = DATA

_, _, body = get("/api/status?down=1")
check("down filter works", lambda: [s["url"] for s in json.loads(body)] == ["https://b.example", "https://c.example"])

status, res, body = get("/")
check("dashboard page is served", lambda: status == 200 and res.getheader("Content-Type", "").startswith("text/html") and b"<table" in body)

page = Path("dashboard.html").read_text()
check("dashboard fetches the api safely", lambda: "fetch(" in page and "/api/status" in page and "textContent" in page and "innerHTML" not in page.split("<script>", 1)[1])

status, res, body = get("/nope")
check("unknown path is a json 404", lambda: status == 404 and res.getheader("Content-Type", "").startswith("application/json") and "error" in json.loads(body))

server.shutdown()
