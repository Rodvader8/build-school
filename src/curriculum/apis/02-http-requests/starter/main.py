"""Talk to a PageSpeed-style API with requests, then again with urllib."""
import json
import urllib.parse
import urllib.request

import requests

SCORE_PATH = "/pagespeedonline/v5/runPagespeed"


def performance_score(base_url, page_url, strategy="mobile"):
    """Ask for the page's score and return it as a whole number out of 100 (0.93 -> 93).
    Returns None if the API says no (a 404, a 500...).
    """
    # TODO: requests.get with params={"url": ..., "strategy": ...} and a timeout, then raise_for_status()
    # The score lives at data["lighthouseResult"]["categories"]["performance"]["score"]
    raise NotImplementedError


def post_score(base_url, site, score):
    """Send {"site": site, "score": score} as JSON to /v1/events and return the new event's id."""
    # TODO: requests.post(..., json=payload, timeout=...). The API answers 201 with {"id": "..."}
    raise NotImplementedError


def performance_score_urllib(base_url, page_url, strategy="mobile"):
    """The same call as performance_score, using only the standard library."""
    # TODO: build the query string with urllib.parse.urlencode, then urllib.request.Request with a
    # "User-Agent: build-school/1.0" header, and urlopen(..., timeout=...)
    raise NotImplementedError


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend API on your own machine.")
