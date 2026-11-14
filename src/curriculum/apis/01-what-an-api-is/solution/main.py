"""A first look at an API: build an address, call it, read what comes back."""
import json
import urllib.error
import urllib.parse
import urllib.request


def build_url(base, path, params=None):
    """Join base + path (exactly one slash between) and add ?key=value&... from params."""
    url = base.rstrip("/") + "/" + path.lstrip("/")
    if params:
        url += "?" + urllib.parse.urlencode(params)
    return url


def status_class(code):
    """Name the family a status code belongs to: success, redirect, client error or server error."""
    if 200 <= code < 300:
        return "success"
    if 300 <= code < 400:
        return "redirect"
    if 400 <= code < 500:
        return "client error"
    if 500 <= code < 600:
        return "server error"
    return "unknown"


def get_json(url):
    """GET the URL and return (status code, parsed JSON body). A 404 is an answer, not a crash."""
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            return response.status, json.loads(response.read())
    except urllib.error.HTTPError as error:
        return error.code, json.loads(error.read())


def summarise(data):
    """Turn {"sites": [{"name": ..., "status": "up"|"down", "ms": ...}]} into one line.
    "3 sites, 1 down: larkfield.example"   or   "3 sites, all up"
    """
    sites = data["sites"]
    down = [s["name"] for s in sites if s["status"] == "down"]
    if not down:
        return f"{len(sites)} sites, all up"
    return f"{len(sites)} sites, {len(down)} down: {', '.join(down)}"


if __name__ == "__main__":
    print(build_url("https://api.example.com", "/v1/sites", {"status": "down", "limit": 5}))
    print(status_class(404))
