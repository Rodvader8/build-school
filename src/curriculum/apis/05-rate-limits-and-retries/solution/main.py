"""Be a polite API client: respect 429s, back off on 5xx errors, and never double-charge on a retry."""
import time
import uuid

import requests

RETRY_STATUSES = {500, 502, 503, 504}


def request_with_retries(method, url, *, max_tries=5, base_delay=0.5, sleep=time.sleep, **kwargs):
    """Send the request, and try again when it's worth trying again.

    - 429 (too many requests): wait as long as the Retry-After header says (seconds), then retry.
    - 500, 502, 503, 504: wait base_delay, then double it each time: 0.5, 1.0, 2.0...
    - anything else wrong (404, 401...): don't retry. Raise requests.HTTPError straight away.
    - still failing after max_tries tries: raise RuntimeError("gave up after N tries ...").
    Never sleep after the last try. Use the `sleep` argument, not time.sleep, so tests don't have to wait.
    """
    for attempt in range(max_tries):
        response = requests.request(method, url, timeout=10, **kwargs)
        if response.status_code != 429 and response.status_code not in RETRY_STATUSES:
            response.raise_for_status()
            return response
        if attempt == max_tries - 1:
            break
        if response.status_code == 429 and "Retry-After" in response.headers:
            sleep(float(response.headers["Retry-After"]))
        else:
            sleep(base_delay * 2**attempt)
    raise RuntimeError(f"gave up after {max_tries} tries (last status {response.status_code})")


def create_charge(base_url, amount_cents, sleep=time.sleep):
    """POST {"amount": amount_cents} to /v1/charges and return the JSON.
    Send an "Idempotency-Key" header, so that if the first attempt succeeds but the answer gets lost
    and we retry, the server gives back the same charge instead of making a second one.
    """
    key = str(uuid.uuid4())
    response = request_with_retries(
        "POST", base_url + "/v1/charges", json={"amount": amount_cents}, headers={"Idempotency-Key": key}, sleep=sleep
    )
    return response.json()


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend, grumpy API on your own machine.")
