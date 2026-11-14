# tests.py: Check my work runs this file. It starts a pretend Google sign-in and Search Console
# on your own machine (no internet), with a fake clock so an hour passes instantly.
# Everything in here is obviously fake. Read it, but don't change it.
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

CLIENT_ID = "test-client-id"
CLIENT_SECRET = "test-client-secret"
REFRESH = "test-refresh-token-not-real"

clock = [0.0]  # the fake time, in seconds
valid = {}  # access token -> the fake time it expires
token_calls = []  # every form posted to /token
api_calls = []  # (path, Authorization header, full request line)


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

    def do_POST(self):
        raw = self.rfile.read(int(self.headers.get("Content-Length", 0))).decode()
        form = {k: v[0] for k, v in parse_qs(raw).items()}
        token_calls.append(form)
        good = (
            self.path == "/token"
            and "x-www-form-urlencoded" in self.headers.get("Content-Type", "")
            and form.get("grant_type") == "refresh_token"
            and form.get("client_id") == CLIENT_ID
            and form.get("client_secret") == CLIENT_SECRET
            and form.get("refresh_token") == REFRESH
        )
        if not good:
            return self.reply(400, {"error": "invalid_grant"})
        token = f"access-{len(token_calls)}"
        valid[token] = clock[0] + 3600
        self.reply(200, {"access_token": token, "expires_in": 3600, "token_type": "Bearer"})

    def do_GET(self):
        auth = self.headers.get("Authorization", "")
        api_calls.append((urlparse(self.path).path, auth, self.requestline))
        token = auth.removeprefix("Bearer ")
        if token not in valid or valid[token] <= clock[0]:
            return self.reply(401, {"error": {"status": "UNAUTHENTICATED"}})
        self.reply(200, {"rows": [{"keys": ["larkfield.example"], "clicks": 42, "impressions": 900}]})


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


def attempt(fn, *args):
    """Run a step of yours; if it fails, the checks that depend on it fail too instead of the whole file stopping."""
    try:
        return fn(*args)
    except Exception as error:
        print(f"  ({fn.__name__} raised {error!r})")
        return None


def manager(refresh=REFRESH):
    return main.TokenManager(base, CLIENT_ID, CLIENT_SECRET, refresh, clock=lambda: clock[0])


m = manager()
first = attempt(m.get_token)
check("get_token swaps the refresh token for an access token", lambda: first == "access-1" and token_calls[0] == {"grant_type": "refresh_token", "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET, "refresh_token": REFRESH})

clock[0] = 100
check("it reuses the token while it's still good", lambda: m.get_token() == "access-1" and len(token_calls) == 1)

clock[0] = 3600 - 50
check("it refreshes shortly before the token expires", lambda: m.get_token() == "access-2" and len(token_calls) == 2)

clock[0] = 4000
data = attempt(main.api_get, m, base, "/v1/searchAnalytics", {"site": "larkfield"})
check("api_get sends the access token and returns the data", lambda: data["rows"][0]["clicks"] == 42 and api_calls[-1][1] == "Bearer access-2" and "site=larkfield" in api_calls[-1][2])

valid.clear()  # the server forgets every token, like a revoked one
before = len(token_calls)
recovered = attempt(main.api_get, m, base, "/v1/searchAnalytics")
check("api_get recovers from a 401 by refreshing once", lambda: recovered["rows"] and len(token_calls) == before + 1)

bad = manager("test-wrong-refresh-token")


def refuses():
    try:
        bad.get_token()
    except Exception as error:
        return type(error).__name__ == "HTTPError"
    return False


check("a refused refresh raises an error instead of looping", refuses)
check("the refresh token never goes to the API itself", lambda: all(REFRESH not in a[1] + a[2] for a in api_calls))

for name in ("GSC_CLIENT_ID", "GSC_CLIENT_SECRET", "GSC_REFRESH_TOKEN"):
    os.environ.pop(name, None)


def missing_name():
    os.environ.update({"GSC_CLIENT_ID": CLIENT_ID, "GSC_CLIENT_SECRET": CLIENT_SECRET})
    try:
        main.from_env(base)
    except RuntimeError as error:
        return "GSC_REFRESH_TOKEN" in str(error) and REFRESH not in str(error)
    return False


check("from_env names the variable that's missing", missing_name)
os.environ["GSC_REFRESH_TOKEN"] = REFRESH
clock[0] = 5000
check("from_env builds a working manager", lambda: main.from_env(base).get_token().startswith("access-"))
server.shutdown()
