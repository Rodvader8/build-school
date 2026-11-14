Every API you'll use has limits. PageSpeed allows so many calls a minute, Search Console a daily quota, an AI model a number of tokens per minute. Run a site monitor across twenty client sites in a loop and you'll hit one. Networks also hiccup: a server restarts, a connection drops. A script that crashes on the first 429 or 503 is a script you can't leave running overnight.

## Which failures are worth retrying?

| Status | Meaning | Retry? |
|---|---|---|
| 429 | Too many requests, slow down | **Yes**, after waiting |
| 500, 502, 503, 504 | The server has a problem | **Yes**, it's often brief |
| 400, 401, 403, 404 | *You* got something wrong | **No.** The same request fails the same way |

Retrying a 404 five times just wastes five requests.

## 429: do what the server says

A rate-limited response usually carries a **`Retry-After`** header: how many seconds to wait.

```python
if response.status_code == 429:
    time.sleep(float(response.headers["Retry-After"]))
```

(Some servers send a date instead of seconds. Read the docs for the API you're calling.)

## 5xx: exponential backoff

With no instruction, wait a little, then longer, then longer again: 0.5s, 1s, 2s, 4s. Each wait doubles.

```python
delay = base_delay * 2**attempt
```

Why double? If a server is overloaded, a hundred clients retrying every half second makes it worse. Backing off gives it room to recover. Production code adds a little random **jitter** to each wait so clients don't all retry at the same instant. We've left it out here so the tests stay predictable.

And always **stop eventually**. Five tries, then raise an error you can read. An endless loop is how a script burns a month's quota overnight.

## The dangerous one: retrying a POST

A GET is safe to repeat. A POST that creates something, such as a Stripe charge or an order, isn't. Imagine the charge goes through but the reply gets lost. Your code sees an error, retries, and bills the customer twice.

The fix is an **idempotency key**: a unique ID you generate once per *operation* and send in a header (`Idempotency-Key`). The server remembers it, and if it sees the same key again, it returns the original result instead of doing the work twice. Stripe works exactly like this.

The one rule: make the key **once**, before the retry loop. A new key per attempt defeats the whole point.

```python
key = str(uuid.uuid4())
```

> To make tests fast, the code takes a `sleep` argument and the tests pass in a fake that just writes the delay down. Passing in the thing that waits, or the clock, is how you test any retry logic.

## Your turn

Open `main.py`.

1. Write `request_with_retries`. It retries on 429 (using `Retry-After`) and on 500, 502, 503 and 504 (with doubling delays), and raises straight away on other errors. After `max_tries` it raises a `RuntimeError`, and it never sleeps after the last try.
2. Finish `create_charge`: one idempotency key, made before the first attempt, sent on every attempt, going through your `request_with_retries`.

Press Check my work. The pretend API makes a charge and then drops the reply, so you'll see if your key does its job.
