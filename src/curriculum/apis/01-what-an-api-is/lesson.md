A site monitor asks Google how fast a page is. A traffic reporter asks an analytics service for last week's sessions. An AI-visibility tracker asks a model a question. All of them are doing the same thing: sending a small text message to a web address and reading the text that comes back. That's an **API**.

## What an API actually is

A website is built for people: HTML, images, a nav. An **API** (application programming interface) is a website built for programs. There's no design, just data, in a predictable shape, at predictable addresses.

Your browser already does this. When you open a page, it sends an **HTTP request** and gets an **HTTP response**. An API works exactly like that, except your Python code is the one asking.

## The request

Every request has four parts:

- **Method**: what you want to do. `GET` reads something, `POST` creates or sends something, `PUT` and `PATCH` change it, `DELETE` removes it.
- **URL**: where, such as `https://api.example.com/v1/sites?status=down&limit=5`. The part after `?` is the **query string**, a list of `key=value` pairs joined with `&`.
- **Headers**: extra information such as who you are (`Authorization`) and what format you want.
- **Body**: the data you're sending, for POST and friends. Usually JSON.

## The response

You get back a **status code**, headers and a body. The first digit tells you the family:

| Code | Means |
|---|---|
| 200 | OK, here's your data |
| 201 | Created |
| 301 | Moved, go to the new address |
| 400 | You sent something wrong |
| 401 | Who are you? (missing or bad key) |
| 403 | I know you, but no |
| 404 | Not found |
| 429 | Too many requests, slow down |
| 500, 503 | The server is in trouble |

Codes in the 400s are **your** fault, and in the 500s **theirs**. That tells you where to look.

## JSON

The body is almost always **JSON**, which you already know from JavaScript. In Python it becomes a dictionary:

```python
import json
data = json.loads('{"sites": [{"name": "larkfield", "status": "up"}]}')
data["sites"][0]["name"]     # "larkfield"
```

## Calling one

Python can do it with nothing installed:

```python
import urllib.request
with urllib.request.urlopen("https://api.example.com/v1/sites") as response:
    print(response.status)
    body = response.read()
```

Next lesson swaps that for the friendlier `requests` library.

> In this lesson you won't touch the internet. `tests.py` starts a pretend API on your own machine and your code talks to that. It's the same code you'd point at the real thing.

## Your turn

Open `main.py` and fill in the four TODO functions.

1. `build_url` joins the base and path with exactly one slash, then adds the query string with `urllib.parse.urlencode`.
2. `status_class` turns a code into "success", "redirect", "client error" or "server error".
3. `get_json` calls the URL and returns `(status, data)`. A 404 should come back as `(404, {...})`, not an exception.
4. `summarise` turns the list of sites into "3 sites, 1 down: larkfield.example", or "3 sites, all up".

Press Check my work. You can read `tests.py` to see the pretend API's exact answers.
