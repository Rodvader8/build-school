"""Keep API keys out of code: read them from a .env file, and never print one in full."""
import os

import requests

# TODO 1: a key typed straight into the code ends up in Git. Delete this line and read the key from the environment instead.
API_KEY = "test-key-not-real-hardcoded"


def load_env(path=".env"):
    """Read KEY=VALUE lines into os.environ and return what was loaded.
    Skip blank lines and # comments, strip spaces and matching quotes around values,
    allow = inside a value, and never overwrite a variable that's already set.
    """
    # TODO 2
    return {}


def mask(secret):
    """Show only the last four characters: "****1234". Anything 8 characters or shorter is just "****"."""
    # TODO 3
    return secret


def get_key(name="SITE_API_KEY"):
    """The key from the environment. If it's missing, raise RuntimeError saying which variable and how to fix it."""
    # TODO 4
    return API_KEY


def call_site_api(base_url):
    """GET /v1/me with the key in an "Authorization: Bearer <key>" header, and return the JSON."""
    response = requests.get(base_url + "/v1/me", headers={"Authorization": "Bearer " + API_KEY}, timeout=10)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    load_env()
    print("Using key", get_key())
