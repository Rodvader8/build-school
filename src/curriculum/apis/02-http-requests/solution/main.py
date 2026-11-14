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
    try:
        response = requests.get(base_url + SCORE_PATH, params={"url": page_url, "strategy": strategy}, timeout=10)
        response.raise_for_status()
    except requests.HTTPError:
        return None
    score = response.json()["lighthouseResult"]["categories"]["performance"]["score"]
    return round(score * 100)


def post_score(base_url, site, score):
    """Send {"site": site, "score": score} as JSON to /v1/events and return the new event's id."""
    response = requests.post(base_url + "/v1/events", json={"site": site, "score": score}, timeout=10)
    response.raise_for_status()
    return response.json()["id"]


def performance_score_urllib(base_url, page_url, strategy="mobile"):
    """The same call as performance_score, using only the standard library."""
    query = urllib.parse.urlencode({"url": page_url, "strategy": strategy})
    request = urllib.request.Request(f"{base_url}{SCORE_PATH}?{query}", headers={"User-Agent": "build-school/1.0"})
    with urllib.request.urlopen(request, timeout=10) as response:
        data = json.loads(response.read())
    return round(data["lighthouseResult"]["categories"]["performance"]["score"] * 100)


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend API on your own machine.")
