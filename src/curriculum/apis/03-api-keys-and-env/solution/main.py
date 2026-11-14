"""Keep API keys out of code: read them from a .env file, and never print one in full."""
import os

import requests


def load_env(path=".env"):
    """Read KEY=VALUE lines into os.environ and return what was loaded.
    Skip blank lines and # comments, strip spaces and matching quotes around values,
    allow = inside a value, and never overwrite a variable that's already set.
    """
    loaded = {}
    try:
        lines = open(path, encoding="utf-8").read().splitlines()
    except FileNotFoundError:
        return loaded
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, _, value = line.partition("=")
        name = name.removeprefix("export ").strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        os.environ.setdefault(name, value)
        loaded[name] = value
    return loaded


def mask(secret):
    """Show only the last four characters: "****1234". Anything 8 characters or shorter is just "****"."""
    if len(secret) <= 8:
        return "****"
    return "****" + secret[-4:]


def get_key(name="SITE_API_KEY"):
    """The key from the environment. If it's missing, raise RuntimeError saying which variable and how to fix it."""
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} isn't set. Copy .env.example to .env and fill it in.")
    return value


def call_site_api(base_url):
    """GET /v1/me with the key in an "Authorization: Bearer <key>" header, and return the JSON."""
    response = requests.get(base_url + "/v1/me", headers={"Authorization": "Bearer " + get_key()}, timeout=10)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    load_env()
    print("Using key", mask(get_key()))
