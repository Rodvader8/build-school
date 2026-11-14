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
            pass

        def do_GET(self):
            self.send(404, "TODO", "text/plain")

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
