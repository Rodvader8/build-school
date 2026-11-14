import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

PAGE = Path(__file__).with_name("dashboard.html")


def make_server(get_status, host="127.0.0.1", port=0):
    """A server that answers with whatever get_status() returns right now."""

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass  # keep the terminal quiet

        def send(self, status, body, content_type):
            """Reply with this status, Content-Type and Content-Length, then the body (str or bytes)."""
            data = body.encode() if isinstance(body, str) else body
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            url = urlparse(self.path)
            if url.path == "/health":
                return self.send(200, "ok", "text/plain; charset=utf-8")
            if url.path == "/api/status":
                sites = get_status()
                if parse_qs(url.query).get("down") == ["1"]:
                    sites = [s for s in sites if s["status"] is None or s["status"] >= 400]
                return self.send(200, json.dumps(sites), "application/json")
            if url.path == "/":
                return self.send(200, PAGE.read_text(), "text/html; charset=utf-8")
            self.send(404, json.dumps({"error": "not found"}), "application/json")

    return HTTPServer((host, port), Handler)


if __name__ == "__main__":
    demo = lambda: [
        {"url": "https://example.com", "status": 200, "ms": 120.5},
        {"url": "https://example.org/broken", "status": 503, "ms": 900.0},
        {"url": "https://nothing.invalid", "status": None, "ms": None},
    ]
    server = make_server(demo, port=8080)
    print("Dashboard on http://127.0.0.1:8080/  (Ctrl+C to stop)")
    server.serve_forever()
