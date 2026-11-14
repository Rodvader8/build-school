import os
import shutil
import subprocess

import requests


def webhook_url():
    """The Slack webhook URL from the SLACK_WEBHOOK_URL environment variable.
    Raise a RuntimeError that mentions the variable's name if it isn't set."""
    url = os.environ.get("SLACK_WEBHOOK_URL")
    if not url:
        raise RuntimeError("SLACK_WEBHOOK_URL isn't set. Put it in your .env file.")
    return url


def send_slack(url, text, timeout=10):
    """POST {"text": text} as JSON. Give up after `timeout` seconds. Raise if the reply is an error. Return True."""
    reply = requests.post(url, json={"text": text}, timeout=timeout)
    reply.raise_for_status()
    return True


def is_up(status):
    """True for a status from 200 to 399. False for anything else, including None (no reply at all)."""
    return status is not None and 200 <= status < 400


def describe_change(url, old, new):
    """The alert for a status change, or None if there's nothing to say.
    up -> down: "DOWN: <url> (<status>)", using "no response" when the status is None.
    down -> up: "UP again: <url>"."""
    if is_up(old) and not is_up(new):
        return f"DOWN: {url} ({new if new is not None else 'no response'})"
    if not is_up(old) and is_up(new):
        return f"UP again: {url}"
    return None


def alert_changes(old, new, send):
    """old and new are {url: status}. Call send(message) for each change, in URL order.
    A URL missing from old is new to us: no alert. Return the list of messages sent."""
    sent = []
    for url in sorted(new):
        if url not in old:
            continue
        message = describe_change(url, old[url], new[url])
        if message:
            send(message)
            sent.append(message)
    return sent


def notify_desktop(title, message):
    """Show a desktop notification with notify-send. Return True if it ran, False if notify-send isn't installed."""
    path = shutil.which("notify-send")
    if path is None:
        return False
    subprocess.run([path, title, message], check=False)
    return True
