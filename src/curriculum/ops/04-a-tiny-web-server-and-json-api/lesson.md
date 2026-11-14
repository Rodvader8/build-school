Once a monitor writes to a database, the file isn't something you glance at over breakfast. A web page is. The standard trick is a tiny server that sits beside the job and answers two kinds of request: "give me the data as JSON" (for programs) and "give me the page" (for people). Python can do it with nothing to install.

## A server is a loop that answers requests

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b"hello"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("127.0.0.1", 8080), Handler).serve_forever()
```

Every GET request lands in `do_GET`. The reply has a fixed order: the status line, then headers, a blank line (`end_headers`), then the body as **bytes**. A string needs `.encode()` first.

## Bind to 127.0.0.1

The address in `HTTPServer(("127.0.0.1", ...))` decides who can reach it. `127.0.0.1` ("localhost") means only this machine. `0.0.0.0` means anyone who can reach the machine on the network. For a dashboard with no login, always start with the first and only widen it deliberately, for example by putting a private network like Tailscale in front. Port `0` means "pick any free port", which is what tests use.

## Routing and the query string

`self.path` is the whole thing the browser asked for, such as `/api/status?down=1`. Split it:

```python
from urllib.parse import urlparse, parse_qs
url = urlparse(self.path)
url.path                    # "/api/status"
parse_qs(url.query)         # {"down": ["1"]}
```

Then an `if` per path. Anything you don't recognise should be a clean **404**, and for an API that means a JSON error, not an HTML page.

## JSON in, page out

```python
json.dumps(data)            # Python list/dict -> text
```

Send it with `Content-Type: application/json` so the browser (and `fetch`) know what it is. The dashboard page is plain HTML with a script that calls your own API:

```js
const res = await fetch("/api/status");
const sites = await res.json();
```

When you put values into the page, use `textContent` (never `innerHTML`). A URL or error message comes from outside your code, and `innerHTML` would run any markup hiding in it.

## Your turn

`make_server(get_status)` takes a function that returns the current list of sites, so the server never keeps stale data. Open `main.py` and `dashboard.html`.

1. Write `send()` so it replies with a status, the two headers and the body.
2. In `do_GET`, handle `/health` (plain `ok`), `/api/status` (JSON, calling `get_status()` each time), `/` (the dashboard page), and a JSON 404 for everything else.
3. Make `/api/status?down=1` return only the sites with a status of 400 or more, or no status at all.
4. In `dashboard.html`, fetch `/api/status` and add a table row per site, using `textContent`.

To see it for real, run `python3 main.py` in the terminal and open http://127.0.0.1:8080/ in a browser. Press Ctrl+C to stop it.

> The tests start your server on a spare port, ask it questions, and stop it again. That's how you test any server.
