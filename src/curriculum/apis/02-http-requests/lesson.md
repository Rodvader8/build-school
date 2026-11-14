Last lesson you saw what an API is. Now you'll call one. Python has `urllib` built in, and `requests`, the library almost everyone uses because it takes the fiddly bits away. (It's already installed on this laptop.) A site monitor's PageSpeed and Search Console calls are `requests` calls.

## urllib: no install needed

```python
import json, urllib.parse, urllib.request

query = urllib.parse.urlencode({"url": "https://larkfield.example", "strategy": "mobile"})
request = urllib.request.Request(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + query,
    headers={"User-Agent": "build-school/1.0"},
)
with urllib.request.urlopen(request, timeout=10) as response:
    data = json.loads(response.read())
```

You build the query string, wrap the request, read the bytes and decode the JSON yourself. It works, and it's good to know when you're in a script that can't install anything. But there's a lot of ceremony.

## requests: the same, shorter

```python
import requests

response = requests.get(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    params={"url": "https://larkfield.example", "strategy": "mobile"},
    timeout=10,
)
response.raise_for_status()
data = response.json()
```

Three things to build into the habit:

- **`params={...}`** builds and escapes the query string. If the page address has its own `?` and `&`, doing it by hand breaks the call.
- **`timeout=`** is mandatory in practice. Without it, one hung server freezes your whole script forever. `requests` has no default timeout.
- **`raise_for_status()`** turns a 4xx or 5xx into a `requests.HTTPError`. Otherwise a failed call silently hands you an error page, and your code carries on as if it were data.

## Sending data

```python
response = requests.post("https://api.example.com/v1/events", json={"site": "larkfield", "score": 93}, timeout=10)
```

`json=` turns the dictionary into a JSON body and sets the `Content-Type: application/json` header. If you need form data instead (an OAuth token call does, in lesson 4), use `data={...}`.

## Reading the response

```python
response.status_code   # 200
response.headers       # a dictionary-like of headers
response.json()        # the body, parsed
response.text          # the body, as a string
```

> The real PageSpeed address is `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`. Your code here takes the base address as an argument, so the tests can point it at a pretend server on your machine. Switching to the real one later is just passing a different string. (Real calls need a key, which is lesson 3.)

## Your turn

Open `main.py`.

1. `performance_score`: call the API with `requests.get`, `params` and a timeout, call `raise_for_status()`, and return the mobile score as a whole number. If the API says 404 or 500, return `None`.
2. `post_score`: send `{"site": ..., "score": ...}` as JSON with `requests.post` and return the new event's `id`.
3. `performance_score_urllib`: the same call as step 1 with only `urllib`, sending a `User-Agent` of `build-school/1.0`.

Press Check my work. It starts a pretend API that records exactly what you sent.
