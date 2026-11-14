"""A first look at an API: build an address, call it, read what comes back."""
import json
import urllib.error
import urllib.parse
import urllib.request


def build_url(base, path, params=None):
    """Join base + path (exactly one slash between) and add ?key=value&... from params."""
    # TODO: use urllib.parse.urlencode for the query string
    return base + path


def status_class(code):
    """Name the family a status code belongs to: success, redirect, client error or server error."""
    # TODO: 200-299, 300-399, 400-499, 500-599
    return "unknown"


def get_json(url):
    """GET the URL and return (status code, parsed JSON body). A 404 is an answer, not a crash."""
    # TODO: urllib.request.urlopen raises urllib.error.HTTPError for 4xx/5xx. The error has .code and can be read like a response.
    raise NotImplementedError


def summarise(data):
    """Turn {"sites": [{"name": ..., "status": "up"|"down", "ms": ...}]} into one line.
    "3 sites, 1 down: larkfield.example"   or   "3 sites, all up"
    """
    # TODO
    return ""


if __name__ == "__main__":
    print(build_url("https://api.example.com", "/v1/sites", {"status": "down", "limit": 5}))
    print(status_class(404))
